import { type DataTypeConfig } from '../../data/config/MetricConfig'
import { type Fips } from '../../data/utils/Fips'
import { type ScrollableHashId } from '../../utils/hooks/useStepObserver'
import HetBreadcrumbs from '../../styles/HetComponents/HetBreadcrumbs'
import SviAlert from './SviAlert'
import { type MetricQueryResponse } from '../../data/query/MetricQuery'
import { type DemographicType } from '../../data/query/Breakdowns'
import { ALL } from '../../data/utils/Constants'
import { type Row } from '../../data/utils/DatasetTypes'

interface GeoContextProps {
  fips: Fips
  updateFipsCallback: (fips: Fips) => void
  dataTypeConfig: DataTypeConfig
  totalPopulationPhrase: string
  subPopulationPhrase: string
  sviQueryResponse: MetricQueryResponse | null
}

const HASH_ID: ScrollableHashId = 'rate-map'

export default function GeoContext(props: GeoContextProps) {
  const { svi } = props.sviQueryResponse?.data?.[0] ?? {}

  return (
    <>
      <HetBreadcrumbs
        fips={props.fips}
        updateFipsCallback={props.updateFipsCallback}
        ariaLabel={props.dataTypeConfig.fullDisplayName}
        scrollToHashId={HASH_ID}
        totalPopulationPhrase={props.totalPopulationPhrase}
        subPopulationPhrase={props.subPopulationPhrase}
      />
      <div className='md:flex md:items-center'>
        {props.fips.isCounty() && (
          <SviAlert
            svi={svi}
            sviQueryResponse={props.sviQueryResponse}
            fips={props.fips}
          />
        )}
      </div>
    </>
  )
}

const POP_MISSING_VALUE = 'unavailable'

export function getTotalACSPopulationPhrase(populationData: Row[]): string {
  const popAllCount: string = populationData[0].population.toLocaleString()
  return `Total Population: ${popAllCount ?? POP_MISSING_VALUE}`
}

export function getSubPopulationPhrase(
  subPopulationData: Row[],
  demographicType: DemographicType,
  dataTypeConfig: DataTypeConfig
): string {
  const subPopConfig = dataTypeConfig.metrics?.sub_population_count
  if (!subPopConfig) return ''
  const allRow = subPopulationData.find((row) => row[demographicType] === ALL)
  const popAllCount: string =
    allRow?.[subPopConfig.metricId]?.toLocaleString() ?? POP_MISSING_VALUE
  return `${subPopConfig.shortLabel}: ${popAllCount}`
}
