"""
This program is intended to be run locally by someone who has access to the CDC
restricted public surveillance data and has downloaded the latest version of
the data from the secure GCS bucket to their local machine. It requires as
flags path and prefix of the CSV files which make up the CDC restricted data
(e.g. "COVID_Cases_Restricted_Detailed_01312021" is the prefix for the 1/31/21
data performs aggregation and standardization, and outputs the resulting CSV
to the same path that was input. The resulting CSVs are intended to be uploaded
to the manual-uploads GCS bucket for consumption by the ingestion pipeline.

Example usage:
python cdc_restricted_local.py --dir="/Users/vanshkumar/Downloads" --prefix="COVID_Cases_Restricted_Detailed_01312021"
"""

import argparse
import os
import sys
import time

import ingestion.standardized_columns as std_col
import ingestion.constants as constants
import numpy as np  # type: ignore
import pandas as pd  # type: ignore

from ingestion.dataset_utils import combine_race_ethnicity

pd.options.mode.chained_assignment = None  # default='warn'

CHUNK_SIZE = 5_000_000

# Command line flags for the dir and file name prefix for the data.
parser = argparse.ArgumentParser()
parser.add_argument("-dir", "--dir", help="Path to the CDC restricted data CSV files")
parser.add_argument(
    "-prefix", "--prefix", help="Prefix for the CDC restricted CSV files"
)

# These are the columns that we want to keep from the data.
# Geo columns (state, county) - we aggregate or groupby either state or county.
# Demog columns (race, age, sex) - we groupby one of these at a time.
# Outcome columns (hosp, death) - these are the measured variables we count.
STATE_COL = 'res_state'
COUNTY_FIPS_COL = 'county_fips_code'
COUNTY_COL = 'res_county'
AGE_COL = 'age_group'
OUTCOME_COLS = ['hosp_yn', 'death_yn']
CASE_DATE_COL = 'cdc_case_earliest_dt'

USE_COLS = [
    STATE_COL,
    COUNTY_FIPS_COL,
    COUNTY_COL,
    std_col.SEX_COL,
    AGE_COL,
    *OUTCOME_COLS,
    std_col.RACE_COL,
    std_col.ETH_COL,
    CASE_DATE_COL,
]

# column no longer provided by CDC that we need to recreate
RACE_ETH_COL = 'race_ethnicity_combined'

# Convenience list for when we group the data by county.
COUNTY_COLS = [COUNTY_FIPS_COL, COUNTY_COL, STATE_COL]

# Mapping from column name in the data to standardized version.
COL_NAME_MAPPING = {
    STATE_COL: std_col.STATE_POSTAL_COL,
    COUNTY_FIPS_COL: std_col.COUNTY_FIPS_COL,
    COUNTY_COL: std_col.COUNTY_NAME_COL,
    RACE_ETH_COL: std_col.RACE_CATEGORY_ID_COL,
    std_col.SEX_COL: std_col.SEX_COL,
    AGE_COL: std_col.AGE_COL,
    CASE_DATE_COL: std_col.TIME_PERIOD_COL,
}

# Mapping for county_fips, county, and state unknown values to "Unknown".
COUNTY_FIPS_NAMES_MAPPING = {"NA": ""}
COUNTY_NAMES_MAPPING = {"Missing": "Unknown", "NA": "Unknown"}
STATE_NAMES_MAPPING = {"Missing": "Unknown", "NA": "Unknown"}

# Mappings for race, sex, and age values in the data to a standardized forms.
# Note that these mappings exhaustively cover the possible values in the data
# as of the latest dataset. New data should be checked for schema changes.
RACE_NAMES_MAPPING = {
    "American Indian/Alaska Native": std_col.Race.AIAN_NH.value,
    "Asian": std_col.Race.ASIAN_NH.value,
    "Black": std_col.Race.BLACK_NH.value,
    "Multiple/Other": std_col.Race.MULTI_OR_OTHER_STANDARD_NH.value,
    "Native Hawaiian/Other Pacific Islander": std_col.Race.NHPI_NH.value,
    "White": std_col.Race.WHITE_NH.value,
    'Hispanic/Latino': std_col.Race.HISP.value,
}

SEX_NAMES_MAPPING = {
    "Male": "Male",
    "Female": "Female",
    "Other": "Other",
    "NA": "Unknown",
    "Missing": "Unknown",
    "Unknown": "Unknown",
}

AGE_NAMES_MAPPING = {
    "0 - 9 Years": "0-9",
    "10 - 19 Years": "10-19",
    "20 - 29 Years": "20-29",
    "30 - 39 Years": "30-39",
    "40 - 49 Years": "40-49",
    "50 - 59 Years": "50-59",
    "60 - 69 Years": "60-69",
    "70 - 79 Years": "70-79",
    "80+ Years": "80+",
    "NA": "Unknown",
    "Missing": "Unknown",
}

# Mapping from geo and demo to relevant column(s) in the data. The demo
# mapping also includes the values mapping for transforming demographic values
# to their standardized form.
GEO_COL_MAPPING = {'state': [STATE_COL], 'county': COUNTY_COLS}
DEMOGRAPHIC_COL_MAPPING = {
    'race': ([std_col.RACE_COL, std_col.ETH_COL], RACE_NAMES_MAPPING),
    'sex': ([std_col.SEX_COL], SEX_NAMES_MAPPING),
    'age': ([AGE_COL], AGE_NAMES_MAPPING),
    'race_and_age': (
        [std_col.RACE_COL, std_col.ETH_COL, AGE_COL],
        {**AGE_NAMES_MAPPING, **RACE_NAMES_MAPPING},
    ),
}


def accumulate_data(df, geo_cols, overall_df, demog_cols, names_mapping):
    """Converts/adds columns for cases, hospitalizations, deaths. Does some
    basic standardization of dataframe elements. Groups by given groupby_cols
    and aggregates. Returns sum of the aggregated df & overall_df.

    df: Pandas dataframe that contains a chunk of all of the raw data.
    geo_cols: List of geo columns we want to groupby / aggregate on.
    overall_df: Pandas dataframe to add our aggregated data to.
    demog_col: Name of the demographic column to aggregate on & standardize.
    names_mapping: Mapping from demographic value to standardized form.
    """
    # Add a columns of all ones, for counting the # of cases / records.
    df[std_col.COVID_CASES] = np.ones(df.shape[0], dtype=int)

    # Add columns for hospitalization yes/no/unknown and death yes/no/unknown,
    # as we aggregate and count these individually. Do a sanity check that we
    # covered all the data and drop the original hospitalization/death columns.
    df[std_col.COVID_HOSP_Y] = df['hosp_yn'] == 'Yes'
    df[std_col.COVID_HOSP_N] = df['hosp_yn'] == 'No'
    df[std_col.COVID_HOSP_UNKNOWN] = (df['hosp_yn'] == 'Unknown') | (
        df['hosp_yn'] == 'Missing'
    )
    df[std_col.COVID_DEATH_Y] = df['death_yn'] == 'Yes'
    df[std_col.COVID_DEATH_N] = df['death_yn'] == 'No'
    df[std_col.COVID_DEATH_UNKNOWN] = (df['death_yn'] == 'Unknown') | (
        df['death_yn'] == 'Missing'
    )

    check_hosp = (
        df[std_col.COVID_HOSP_Y]
        | df[std_col.COVID_HOSP_N]
        | df[std_col.COVID_HOSP_UNKNOWN]
    ).all()
    check_deaths = (
        df[std_col.COVID_DEATH_Y]
        | df[std_col.COVID_DEATH_N]
        | df[std_col.COVID_DEATH_UNKNOWN]
    ).all()

    assert check_hosp, "All possible hosp_yn values are not accounted for"
    assert check_deaths, "All possible death_yn values are not accounted for"

    df = df.drop(columns=['hosp_yn', 'death_yn'])

    # Standardize the values in demog_col using names_mapping.
    for demog_col in demog_cols:
        if demog_col == RACE_ETH_COL:
            df = combine_race_ethnicity(df, RACE_NAMES_MAPPING, 'Hispanic/Latino')
        else:
            df = df.replace({demog_col: names_mapping})

    # Only keep the year and the month of the date
    df[CASE_DATE_COL] = df[CASE_DATE_COL].map(lambda x: x[:7])

    # Group by the geo and demographic columns and compute the sum/counts of
    # cases/hospitalizations/deaths. Add total rows and add to overall_df.
    groupby_cols = geo_cols + demog_cols
    total_groupby_cols = geo_cols

    groupby_cols = groupby_cols + [CASE_DATE_COL]
    total_groupby_cols = total_groupby_cols + [CASE_DATE_COL]

    df = df.groupby(groupby_cols).sum().reset_index()
    totals = df.groupby(total_groupby_cols).sum().reset_index()

    # Special case required due to later processing.
    if demog_cols[0] == RACE_ETH_COL:
        totals[demog_cols[0]] = std_col.Race.ALL.value
    else:
        totals[demog_cols[0]] = std_col.ALL_VALUE

    df = pd.concat([df, totals])
    df = df.set_index(groupby_cols)

    if not overall_df.empty:
        return overall_df.add(df, fill_value=0)

    return df


def sanity_check_data(df):
    # Perform some simple sanity checks that we are covering all the data.
    cases = df[std_col.COVID_CASES]
    assert cases.equals(
        df[std_col.COVID_HOSP_Y]
        + df[std_col.COVID_HOSP_N]
        + df[std_col.COVID_HOSP_UNKNOWN]
    )
    assert cases.equals(
        df[std_col.COVID_DEATH_Y]
        + df[std_col.COVID_DEATH_N]
        + df[std_col.COVID_DEATH_UNKNOWN]
    )


def generate_national_dataset(state_df, groupby_cols):
    """Generates a national level dataset from the state_df.
    Returns a national level dataframe

    state_df: state level dataframe
    groupby_cols: list of columns to group on"""

    # This is hacky but I think we have to do this because everything comes
    # from big query as a string.
    int_cols = [std_col.COVID_CASES, std_col.COVID_DEATH_Y, std_col.COVID_HOSP_Y]
    state_df[int_cols] = state_df[int_cols].fillna(0)
    state_df[int_cols] = state_df[int_cols].replace("", 0)
    state_df[int_cols] = state_df[int_cols].astype(int)

    df = state_df.groupby(groupby_cols).sum().reset_index()

    df[std_col.STATE_FIPS_COL] = constants.US_FIPS
    df[std_col.STATE_NAME_COL] = constants.US_NAME

    needed_cols = [
        std_col.STATE_FIPS_COL,
        std_col.STATE_NAME_COL,
        std_col.COVID_CASES,
        std_col.COVID_DEATH_Y,
        std_col.COVID_HOSP_Y,
    ]

    needed_cols.extend(groupby_cols)
    return df[needed_cols].reset_index(drop=True)


def process_data(dir, files):
    """Given a directory and a list of files which contain line item-level
    covid data, standardizes and aggregates by race, age, and sex. Returns a
    map from (geography, demographic) to the associated dataframe.

    dir: Directory in which the files live.
    files: List of file paths that contain covid data.
    """

    all_demographic_combos = [
        ("state", "race"),
        ("county", "race"),
        ("state", "age"),
        ("county", "age"),
        ("state", "sex"),
        ("county", "sex"),
        # for age adjustment
        ("state", "race_and_age"),
    ]

    all_dfs = {}
    for combo in all_demographic_combos:
        all_dfs[combo] = pd.DataFrame()

    for f in sorted(files):
        start = time.time()

        # Note that we read CSVs with keep_default_na = False as we want to
        # prevent pandas from interpreting "NA" in the data as NaN
        chunked_frame = pd.read_csv(
            os.path.join(dir, f),
            dtype=str,
            chunksize=CHUNK_SIZE,
            keep_default_na=False,
            usecols=USE_COLS,
        )

        for chunk in chunked_frame:

            # We first do a bit of cleaning up of geo values and str values.
            df = chunk.replace({COUNTY_FIPS_COL: COUNTY_FIPS_NAMES_MAPPING})
            df = df.replace({COUNTY_COL: COUNTY_NAMES_MAPPING})
            df = df.replace({STATE_COL: STATE_NAMES_MAPPING})

            # For county fips, we make sure they are strings of length 5 as per
            # our standardization (ignoring empty values).
            df[COUNTY_FIPS_COL] = df[COUNTY_FIPS_COL].map(
                lambda x: x.zfill(5) if len(x) > 0 else x
            )

            # For each of ({state, county} x {race, sex, age}), we slice the
            # data to focus on that dimension and aggregate.
            for (geo, demo), _ in all_dfs.items():
                # Build the columns we will group by.
                geo_cols = GEO_COL_MAPPING[geo]
                demog_col, demog_names_mapping = DEMOGRAPHIC_COL_MAPPING[demo]

                # Slice the data and aggregate for the given dimension.
                sliced_df = df[geo_cols + demog_col + OUTCOME_COLS + [CASE_DATE_COL]]

                if demo == 'race':
                    demog_col = [RACE_ETH_COL]

                if demo == 'race_and_age':
                    demog_col = [RACE_ETH_COL, AGE_COL]

                all_dfs[(geo, demo)] = accumulate_data(
                    sliced_df,
                    geo_cols,
                    all_dfs[(geo, demo)],
                    demog_col,
                    demog_names_mapping,
                )

        end = time.time()
        print("Took", round(end - start), "seconds to process file", f)

    # Post-processing of the data.
    for key in all_dfs.copy():
        geo, demographic = key

        # Some brief sanity checks to make sure the data is OK.
        sanity_check_data(all_dfs[key])

        # The outcomes data is automatically converted to float when the chunks
        # are added together, so we convert back to int here. We also reset the
        # index for simplicity.
        all_dfs[key] = all_dfs[key].astype(int).reset_index()

        # Standardize the column names and race/age/sex values.
        all_dfs[key] = all_dfs[key].rename(columns=COL_NAME_MAPPING)

        # Standardize all None/NaNs in the data to an empty string, and convert
        # everything to string before returning & writing to CSV.
        all_dfs[key] = all_dfs[key].fillna("").astype(str)

    return all_dfs


def main():
    # Get the dir and prefix from the command line flags.
    args = parser.parse_args()
    dir = args.dir
    prefix = args.prefix

    # Get the files in the specified directory which match the prefix.
    matching_files = []
    files = [f for f in os.listdir(dir) if os.path.isfile(os.path.join(dir, f))]
    for f in files:
        filename_parts = f.split('.')
        if (
            len(filename_parts) == 2
            and prefix in filename_parts[0]
            and filename_parts[1] == 'csv'
        ):
            matching_files.append(f)

    if len(matching_files) == 0:
        print("Unable to find any files that match the prefix!")
        sys.exit()

    print("Matching files: ")
    for f in matching_files:
        print(f)

    all_dfs = process_data(dir, matching_files)

    # Write the results out to CSVs.
    for (geo, demo), df in all_dfs.items():
        file_path = os.path.join(dir, f"cdc_restricted_by_{demo}_{geo}.csv")
        df.to_csv(file_path, index=False)


if __name__ == "__main__":
    main()
