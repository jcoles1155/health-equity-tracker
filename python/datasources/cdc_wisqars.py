import pandas as pd
import numpy as np
from datasources.data_source import DataSource
from ingestion.constants import (
    CURRENT,
    HISTORICAL,
    US_NAME,
    NATIONAL_LEVEL,
    STATE_LEVEL,
)
from ingestion import gcs_to_bq_util, standardized_columns as std_col
from ingestion.dataset_utils import (
    combine_race_ethnicity,
    generate_pct_rel_inequity_col,
    generate_pct_share_col_without_unknowns,
    generate_pct_share_col_with_unknowns,
    generate_per_100k_col,
    generate_time_df_with_cols_and_types,
)
from ingestion.merge_utils import merge_state_ids

from ingestion.cdc_wisqars_utils import (
    generate_cols_map,
    DATA_DIR,
    WISQARS_COLS,
    convert_columns_to_numeric,
    contains_unknown,
    RACE_NAMES_MAPPING,
    INJ_INTENTS,
    INJ_OUTCOMES,
)

"""
Data Source: CDC WISQARS (data on gun violence)

Description:
- The data on gun violence (general population) is downloaded from the CDC WISQARS database.
- The downloaded data is stored locally in our data/cdc_wisqars directory for subsequent use.

Instructions for Downloading Data:
1. Visit the WISQARS website: https://wisqars.cdc.gov/reports/
2. Select the injury outcome:
    - `Fatal` or `Nonfatal`
3. Select the desired data years:
    - `2001-2021`
4. Select the geography:
    - `United States`
5. Select the intent:
    - `All Intents`
6. Select the mechanism:
    - `Firearm`
7. Select the demographic selections:
   - `All ages`, `Both Sexes`, `All Races`
8. Select appropriate report layout:
   - For fatal_gun_injuries-national-all: `Intent`, `None`, `None`, `None`
   - For fatal_gun_injuries-national-race: `Intent`, `Race`, `Ethnicity`, `None`
   - For non_fatal_gun_injuries--state-all: `Intent`, `State`, `None`, `None`
   - For non_fatal_gun_injuries-state-age: `Intent`, `State`, `Age Group`, `None`

Notes:
- There is no state-level data on non-fatal injury outcomes
- Race data is only available for fatal data and is available from 2018-2021

Last Updated: 2/24
"""

PER_100K_MAP = generate_cols_map(INJ_INTENTS, std_col.PER_100K_SUFFIX)
RAW_TOTALS_MAP = generate_cols_map(INJ_INTENTS, std_col.RAW_SUFFIX)
PCT_SHARE_MAP = generate_cols_map(RAW_TOTALS_MAP.values(), std_col.PCT_SHARE_SUFFIX)
PCT_SHARE_MAP[std_col.FATAL_POPULATION] = std_col.FATAL_POPULATION_PCT
PCT_SHARE_MAP[std_col.NON_FATAL_POPULATION] = std_col.NON_FATAL_POPULATION_PCT
PCT_REL_INEQUITY_MAP = generate_cols_map(RAW_TOTALS_MAP.values(), std_col.PCT_REL_INEQUITY_SUFFIX)

PIVOT_DEM_COLS = {
    std_col.AGE_COL: ["year", "state", "age group", "population"],
    std_col.RACE_OR_HISPANIC_COL: ["year", "state", "race", "ethnicity", "population"],
    std_col.SEX_COL: ["year", "state", "sex", "population"],
    "all": ["year", "state", "population"],
}

TIME_MAP = {
    CURRENT: list(RAW_TOTALS_MAP.values()) + list(PER_100K_MAP.values()) + list(PCT_SHARE_MAP.values()),
    HISTORICAL: list(PER_100K_MAP.values()) + list(PCT_REL_INEQUITY_MAP.values()) + list(PCT_SHARE_MAP.values()),
}


class CDCWisqarsData(DataSource):
    @staticmethod
    def get_id():
        return "CDC_WISQARS_DATA"

    @staticmethod
    def get_table_name():
        return "cdc_wisqars_data"

    def upload_to_gcs(self, gcs_bucket, **attrs):
        raise NotImplementedError("upload_to_gcs should not be called for CDCWISQARS")

    def write_to_bq(self, dataset, gcs_bucket, **attrs):
        demographic = self.get_attr(attrs, "demographic")
        geo_level = self.get_attr(attrs, "geographic")

        national_totals_by_intent_df = load_wisqars_df_from_data_dir("all", geo_level)

        if demographic == std_col.RACE_OR_HISPANIC_COL:
            national_totals_by_intent_df.insert(2, 'race', std_col.Race.ALL.value)
        else:
            national_totals_by_intent_df.insert(2, demographic, std_col.ALL_VALUE)

        df = self.generate_breakdown_df(demographic, geo_level, national_totals_by_intent_df)

        for table_type in (CURRENT, HISTORICAL):
            table_name = f"{demographic}_{geo_level}_{table_type}"
            time_cols = TIME_MAP[table_type]

            df_for_bq, col_types = generate_time_df_with_cols_and_types(df, time_cols, table_type, demographic)

            gcs_to_bq_util.add_df_to_bq(df_for_bq, dataset, table_name, column_types=col_types)

    def generate_breakdown_df(self, breakdown: str, geo_level: str, alls_df: pd.DataFrame):
        """generate_breakdown_df generates a gun violence data frame by breakdown and geo_level

        breakdown: string equal to `age`, `race_and_ethnicity, or `sex`
        geo_level: string equal to `national` or `state`
        alls_df: the data frame containing the all values for each demographic breakdown
        return: a data frame of national time-based WISQARS data by breakdown"""

        cols_to_standard = {
            "race": std_col.RACE_CATEGORY_ID_COL,
            "state": std_col.STATE_NAME_COL,
            "year": std_col.TIME_PERIOD_COL,
        }

        breakdown_group_df = load_wisqars_df_from_data_dir(breakdown, geo_level)

        combined_group_df = pd.concat([breakdown_group_df, alls_df], axis=0)

        df = combined_group_df.rename(columns=cols_to_standard)

        if breakdown == std_col.RACE_OR_HISPANIC_COL:
            std_col.add_race_columns_from_category_id(df)

        df = merge_state_ids(df)

        # adds missing columns
        combined_cols = list(PER_100K_MAP.values()) + list(RAW_TOTALS_MAP.values())
        for col in combined_cols:
            if col not in df.columns:
                df[col] = np.nan

        if std_col.NON_FATAL_POPULATION not in df.columns:
            df[std_col.NON_FATAL_POPULATION] = np.nan

        # detect if data frame has unknown values
        has_unknown = df.applymap(contains_unknown).any().any()

        if has_unknown:
            unknown = 'Unknown'
            if breakdown == std_col.RACE_OR_HISPANIC_COL:
                unknown = 'Unknown race'
            df = generate_pct_share_col_with_unknowns(df, PCT_SHARE_MAP, breakdown, std_col.ALL_VALUE, unknown)
        else:
            df = generate_pct_share_col_without_unknowns(df, PCT_SHARE_MAP, breakdown, std_col.ALL_VALUE)

        for col in RAW_TOTALS_MAP.values():
            pop_col = std_col.FATAL_POPULATION_PCT
            if col == std_col.GUN_VIOLENCE_INJURIES_RAW:
                pop_col = std_col.NON_FATAL_POPULATION_PCT
            df = generate_pct_rel_inequity_col(df, PCT_SHARE_MAP[col], pop_col, PCT_REL_INEQUITY_MAP[col])

        return df


def load_wisqars_df_from_data_dir(breakdown: str, geo_level: str):
    """
    load_wisqars_df_from_data_dir generates WISQARS data by breakdown and geo_level

    breakdown: string equal to `age`, `race_and_ethnicity`, or `sex`
    geo_level: string equal to `national`, or `state`
    return: a data frame of time-based WISQARS data by breakdown and geo_level with
    WISQARS columns
    """
    output_df = pd.DataFrame(columns=["year"])

    for outcome in INJ_OUTCOMES:
        data_metric = 'deaths'
        data_column_name = 'intent'

        if outcome == std_col.NON_FATAL_PREFIX:
            data_metric = 'estimated number'
            data_column_name = 'year'
            if geo_level == STATE_LEVEL or breakdown == std_col.RACE_OR_HISPANIC_COL:
                continue

        df = gcs_to_bq_util.load_csv_as_df_from_data_dir(
            DATA_DIR,
            f"{outcome}_gun_injuries-{geo_level}-{breakdown}.csv",
            na_values=["--", "**"],
            usecols=lambda x: x not in WISQARS_COLS,
            thousands=",",
            dtype={"Year": str},
        )

        df.columns = df.columns.str.lower()

        # removes the metadata section from the csv
        metadata_start_index = df[df[data_column_name] == "Total"].index
        metadata_start_index = metadata_start_index[0]
        df = df.iloc[:metadata_start_index]

        # cleans data frame
        columns_to_convert = [data_metric, 'crude rate']
        convert_columns_to_numeric(df, columns_to_convert)

        if geo_level == NATIONAL_LEVEL:
            df.insert(1, "state", US_NAME)

        if outcome == std_col.FATAL_PREFIX:
            df = df[(df['intent'] != 'Unintentional') & (df['intent'] != 'Undetermined')]

            # reshapes df to add the intent rows as columns
            pivot_df = df.pivot(
                index=PIVOT_DEM_COLS.get(breakdown, []),
                columns="intent",
                values=['deaths', 'crude rate'],
            )

            pivot_df.columns = [
                (
                    f"gun_violence_{col[1].lower().replace(' ', '_')}_{std_col.RAW_SUFFIX}"
                    if col[0] == 'deaths'
                    else f"gun_violence_{col[1].lower().replace(' ', '_')}_{std_col.PER_100K_SUFFIX}"
                )
                for col in pivot_df.columns
            ]

            df = pivot_df.reset_index()

        df.rename(
            columns={
                "age group": std_col.AGE_COL,
                'estimated number': std_col.GUN_VIOLENCE_INJURIES_RAW,
                'population': f'{outcome}_population',
                'crude rate': std_col.GUN_VIOLENCE_INJURIES_PER_100K,
                'sex': std_col.SEX_COL,
            },
            inplace=True,
        )

        if std_col.ETH_COL in df.columns.to_list():
            df = combine_race_ethnicity(df, RACE_NAMES_MAPPING)
            df = df.rename(columns={'race_ethnicity_combined': 'race'})

            # Combines the unknown and hispanic rows
            df = df.groupby(['year', 'state', 'race']).sum(min_count=1).reset_index()

            # Identify rows where 'race' is 'HISP' or 'UNKNOWN'
            subset_mask = df['race'].isin(['HISP', 'UNKNOWN'])

            # Create a temporary DataFrame with just the subset
            temp_df = df[subset_mask].copy()

            # Apply the function to the temporary DataFrame
            for raw_total in RAW_TOTALS_MAP.values():
                if raw_total in df.columns:
                    temp_df = generate_per_100k_col(temp_df, raw_total, f'{outcome}_population', 'crude rate')

            # Update the original DataFrame with the results for the 'crude rate' column
            df.loc[subset_mask, 'crude rate'] = temp_df['crude rate']

        output_df = output_df.merge(df, how="outer")

    return output_df
