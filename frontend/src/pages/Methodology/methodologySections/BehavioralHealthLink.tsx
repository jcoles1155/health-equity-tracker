import { MENTAL_HEALTH_RESOURCES } from '../methodologyContent/ResourcesData'
import Resources from '../methodologyComponents/Resources'
import StripedTable from '../methodologyComponents/StripedTable'
import { Helmet } from 'react-helmet-async'
import { DATA_CATALOG_PAGE_LINK } from '../../../utils/internalRoutes'
import { DATA_SOURCE_PRE_FILTERS } from '../../../utils/urlutils'
import LifelineAlert from '../../../reports/ui/LifelineAlert'
import KeyTermsTopicsAccordion from '../methodologyComponents/KeyTermsTopicsAccordion'
import { BEHAVIORAL_HEALTH_CATEGORY_DROPDOWNIDS } from '../../../data/config/MetricConfigBehavioralHealth'
import {
  METRIC_CONFIG,
  buildTopicsString,
} from '../../../data/config/MetricConfig'
import { dataSourceMetadataMap } from '../../../data/config/MetadataMap'
import NoteBrfss from '../methodologyComponents/NoteBrfss'
import AhrMetrics from '../methodologyComponents/AhrMetrics'

// All data _sources_ used for Behavioral Health category
const behavioralHealthDataSources = [
  dataSourceMetadataMap.acs,
  dataSourceMetadataMap.ahr,
]

// All metric configs used for Behavioral Health category topics
const datatypeConfigs = BEHAVIORAL_HEALTH_CATEGORY_DROPDOWNIDS.map(
  (dropdownId) => {
    return METRIC_CONFIG[dropdownId]
  }
).flat()

export const behavioralHealthTopicsString = buildTopicsString(
  BEHAVIORAL_HEALTH_CATEGORY_DROPDOWNIDS
)

export default function BehavioralHealthLink() {
  return (
    <section id='#behavioral-health'>
      <article>
        <Helmet>
          <title>Behavioral Health - Health Equity Tracker</title>
        </Helmet>
        <h2 className='sr-only'>Behavioral Health</h2>

        <StripedTable
          id='#categories-table'
          applyThickBorder={false}
          columns={[
            { header: 'Category', accessor: 'category' },
            { header: 'Topics', accessor: 'topic' },
          ]}
          rows={[
            {
              category: 'Behavioral Health',
              topic: behavioralHealthTopicsString,
            },
          ]}
        />
        <h3
          className='mt-12 text-title font-medium'
          id='#behavioral-health-data-sourcing'
        >
          Data Sourcing
        </h3>
        <p>
          The data on behavioral health conditions such as frequent mental
          distress, depression, and excessive drinking, featured in the Health
          Equity Tracker, primarily comes from{' '}
          <a href={'urlMap.amr'}>America’s Health Rankings (AHR)</a>. AHR
          primarily relies on the{' '}
          <a href={'urlMap.cdcBrfss'}>
            Behavioral Risk Factor Surveillance System (BRFSS)
          </a>{' '}
          survey conducted by the CDC, supplemented by data from{' '}
          <a href={'urlMap.cdcWonder'}>CDC WONDER</a> and the{' '}
          <a href={'urlMap.censusVoting'}>U.S. Census</a>.{' '}
        </p>
        <NoteBrfss />

        <AhrMetrics />

        <h3
          className='mt-12 text-title font-medium'
          id='#behavioral-health-data-sources'
        >
          Data Sources
        </h3>
        <StripedTable
          applyThickBorder={false}
          columns={[
            { header: 'Source', accessor: 'source' },
            { header: 'Update Frequency', accessor: 'updates' },
          ]}
          rows={behavioralHealthDataSources.map((source, index) => ({
            source: (
              <a
                key={index}
                href={`${DATA_CATALOG_PAGE_LINK}?${DATA_SOURCE_PRE_FILTERS}=${source.id}`}
              >
                {source.data_source_name}
              </a>
            ),
            updates: source.update_frequency,
          }))}
        />
        <KeyTermsTopicsAccordion
          hashId='#behavioral-health-key-terms'
          datatypeConfigs={datatypeConfigs}
        />

        <Resources
          id='#behavioral-health-resources'
          resourceGroups={[MENTAL_HEALTH_RESOURCES]}
        />

        <div className='pt-5'>
          <LifelineAlert />
        </div>
      </article>
    </section>
  )
}
