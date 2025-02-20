import { EXPLORE_DATA_PAGE_LINK } from '../../utils/internalRoutes'
import {
  type AgeAdjustedDataTypeId,
  type DataTypeConfig,
} from '../../data/config/MetricConfig'
import { dataTypeLinkMap } from '../../data/providers/CdcCovidProvider'

interface AltDataTypesMessageProps {
  ageAdjustedDataTypes: DataTypeConfig[]
  setDataTypeConfigWithParam?: any
}
export default function AltDataTypesMessage(props: AltDataTypesMessageProps) {
  if (!props.ageAdjustedDataTypes) return <></>
  return (
    <>
      {' '}
      Age-adjusted ratios by race and ethnicity at the national and state levels
      are available for these alternate data types:{' '}
      {props.ageAdjustedDataTypes.map((dataType, i) => {
        return (
          <span key={dataType.fullDisplayName}>
            <a
              href={`${EXPLORE_DATA_PAGE_LINK}${
                dataTypeLinkMap[dataType.dataTypeId as AgeAdjustedDataTypeId] ??
                ''
              }#age-adjusted-ratios`}
            >
              {dataType.fullDisplayName}
            </a>
            {i < props.ageAdjustedDataTypes.length - 1 && ', '}
            {i === props.ageAdjustedDataTypes.length - 1 && '.'}
          </span>
        )
      })}
    </>
  )
}
