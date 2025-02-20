import os
import json
import pandas as pd

# Current working directory.
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = os.path.join(THIS_DIR, os.pardir, "data", "utils")


def get_state_fips_codes_as_df() -> pd.DataFrame:
    return pd.read_json(os.path.join(TEST_DIR, 'state_fips.json'), dtype=str)


def get_acs_metadata_as_json(year: int):
    metadata_file = 'acs_metadata_2021_and_earlier.json' if year < 2022 else 'acs_metadata_2022_and_later.json'
    with open(os.path.join(TEST_DIR, metadata_file)) as f:
        return json.load(f)


def _load_df_from_bigquery(*args, **kwargs) -> pd.DataFrame:
    """Mock calls to HET BiqQuery tables with local versions"""
    datasource_name, table_name, dtypes = args
    if "county" in table_name:
        dtypes["county_fips"] = str
    filename = f'{datasource_name}-{table_name}.ndjson'
    file_path = os.path.join(THIS_DIR, "het_bq_tables_for_mocks", filename)
    print("MOCKING READ FROM HET BQ:", filename)

    pop_df = pd.read_json(file_path, lines=True, dtype=dtypes)

    return pop_df


def _load_public_dataset_from_bigquery_as_df(*args, **kwargs) -> pd.DataFrame:
    """Mock calls to public BiqQuery tables with local versions"""
    public_dataset_name, table_name = args

    filename = f'{public_dataset_name}-{table_name}.csv'
    file_path = os.path.join(THIS_DIR, "het_bq_tables_for_mocks", filename)
    print("MOCKING READ FROM PUBLIC BQ:", filename)

    county_names_df = pd.read_csv(
        file_path,
        dtype={"state_fips_code": str, "county_fips_code": str},
    )

    return county_names_df
