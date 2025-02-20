import IncarcerationProvider from './IncarcerationProvider'
import { Breakdowns, DemographicType } from '../query/Breakdowns'
import { MetricQuery, MetricQueryResponse } from '../query/MetricQuery'
import { Fips } from '../utils/Fips'
import { DatasetId, DatasetMetadataMap } from '../config/DatasetMetadata'
import {
  autoInitGlobals,
  getDataFetcher,
  resetCacheDebug,
} from '../../utils/globals'
import FakeDataFetcher from '../../testing/FakeDataFetcher'
import { RACE, AGE, SEX } from '../utils/Constants'
import { MetricId, DataTypeId } from '../config/MetricConfig'
import { appendFipsIfNeeded } from '../utils/datasetutils'

export async function ensureCorrectDatasetsDownloaded(
  IncarcerationDatasetId: DatasetId,
  baseBreakdown: Breakdowns,
  demographicType: DemographicType,
  dataTypeId: DataTypeId,
  acsDatasetIds?: DatasetId[]
) {
  // if these aren't sent as args, default to []
  acsDatasetIds = acsDatasetIds || []

  const incarcerationProvider = new IncarcerationProvider()

  const specificId = appendFipsIfNeeded(IncarcerationDatasetId, baseBreakdown)

  dataFetcher.setFakeDatasetLoaded(specificId, [])

  // Evaluate the response with requesting "All" field
  const responseIncludingAll = await incarcerationProvider.getData(
    new MetricQuery([], baseBreakdown.addBreakdown(demographicType), dataTypeId)
  )

  expect(dataFetcher.getNumLoadDatasetCalls()).toBe(1)

  const consumedDatasetIds = [IncarcerationDatasetId]
  consumedDatasetIds.push(...acsDatasetIds)

  expect(responseIncludingAll).toEqual(
    new MetricQueryResponse([], consumedDatasetIds)
  )
}

autoInitGlobals()
const dataFetcher = getDataFetcher() as FakeDataFetcher

describe('IncarcerationProvider', () => {
  beforeEach(() => {
    resetCacheDebug()
    dataFetcher.resetState()
    dataFetcher.setFakeMetadataLoaded(DatasetMetadataMap)
  })

  test('County and Race Breakdown for Prison', async () => {
    await ensureCorrectDatasetsDownloaded(
      'vera_incarceration_county-by_race_and_ethnicity_county_time_series',
      Breakdowns.forFips(new Fips('06037')),
      RACE,
      'prison',
      []
    )
  })

  test('State and Race Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-race_and_ethnicity_state',
      Breakdowns.forFips(new Fips('37')),
      RACE,
      'jail',
      ['acs_population-by_race_state']
    )
  })

  test('National and Race Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-race_and_ethnicity_national',
      Breakdowns.forFips(new Fips('00')),
      RACE,
      'jail',
      ['acs_population-by_race_national']
    )
  })

  test('County and Age Breakdown for Jail', async () => {
    await ensureCorrectDatasetsDownloaded(
      'vera_incarceration_county-by_age_county_time_series',
      Breakdowns.forFips(new Fips('06037')),
      AGE,
      'jail',
      []
    )
  })

  test('State and Age Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-age_state',
      Breakdowns.forFips(new Fips('37')),
      AGE,
      'prison',
      ['acs_population-by_age_state']
    )
  })

  test('National and Age Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-age_national',
      Breakdowns.forFips(new Fips('00')),
      AGE,
      'prison',
      ['acs_population-by_age_national']
    )
  })

  test('County and Sex Breakdown for Jail', async () => {
    await ensureCorrectDatasetsDownloaded(
      'vera_incarceration_county-by_sex_county_time_series',
      Breakdowns.forFips(new Fips('06037')),
      SEX,
      'jail',
      []
    )
  })

  test('State and Sex Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-sex_state',
      Breakdowns.forFips(new Fips('37')),
      SEX,
      'jail',
      ['acs_population-by_sex_state']
    )
  })

  test('National and Sex Breakdown', async () => {
    await ensureCorrectDatasetsDownloaded(
      'bjs_incarceration_data-sex_national',
      Breakdowns.forFips(new Fips('00')),
      SEX,
      'jail',
      ['acs_population-by_sex_national']
    )
  })
})
