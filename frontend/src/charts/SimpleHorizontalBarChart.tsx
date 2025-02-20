import { Vega } from 'react-vega'
import { type Row } from '../data/utils/DatasetTypes'
import { useResponsiveWidth } from '../utils/hooks/useResponsiveWidth'
import {
  type DemographicType,
  type DemographicTypeDisplayName,
  DEMOGRAPHIC_DISPLAY_TYPES_LOWER_CASE,
} from '../data/query/Breakdowns'
import { type MetricConfig, type MetricId } from '../data/config/MetricConfig'
import {
  addLineBreakDelimitersToField,
  MULTILINE_LABEL,
  AXIS_LABEL_Y_DELTA,
  oneLineLabel,
  addMetricDisplayColumn,
  PADDING_FOR_ACTIONS_MENU,
  getAltGroupLabel,
  LABEL_HEIGHT,
} from './utils'
import { CAWP_METRICS } from '../data/providers/CawpProvider'
import { HIV_METRICS } from '../data/providers/HivProvider'
import { createBarLabel } from './mapHelperFunctions'
import { het, ThemeZIndexValues } from '../styles/DesignTokens'

// determine where (out of 100) to flip labels inside/outside the bar
const LABEL_SWAP_CUTOFF_PERCENT = 66

function getSpec(
  altText: string,
  data: Row[],
  width: number,
  demographicType: DemographicType,
  demographicTypeDisplayName: DemographicTypeDisplayName,
  measure: MetricId,
  measureDisplayName: string,
  // Column names to use for the display value of the metric. These columns
  // contains preformatted data as strings.
  barMetricDisplayColumnName: string,
  tooltipMetricDisplayColumnName: string,
  showLegend: boolean,
  barLabelBreakpoint: number,
  usePercentSuffix: boolean
): any {
  const MEASURE_COLOR = het.altGreen
  const BAR_HEIGHT = 60
  const BAR_PADDING = 0.2
  const DATASET = 'DATASET'
  const chartIsSmall = width < 400

  const createAxisTitle = () => {
    if (chartIsSmall) {
      return measureDisplayName.split(' ')
    } else return measureDisplayName
  }

  // create bar label as array or string
  const barLabel = createBarLabel(
    chartIsSmall,
    measure,
    tooltipMetricDisplayColumnName,
    usePercentSuffix
  )

  const legends = showLegend
    ? [
        {
          fill: 'variables',
          orient: 'top',
          padding: 4,
        },
      ]
    : []

  const onlyZeros = data.every((row) => {
    return !row[measure]
  })

  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description: altText,
    background: het.white,
    autosize: { resize: true, type: 'fit-x' },
    width: width - PADDING_FOR_ACTIONS_MENU,
    style: 'cell',
    data: [
      {
        name: DATASET,
        values: data,
      },
    ],
    signals: [
      {
        name: 'y_step',
        value: BAR_HEIGHT,
      },
      {
        name: 'height',
        update: "bandspace(domain('y').length, 0.1, 0.05) * y_step",
      },
    ],
    marks: [
      {
        // chart bars
        name: 'measure_bars',
        type: 'rect',
        style: ['bar'],
        description: data.length + ' items',
        from: { data: DATASET },
        encode: {
          enter: {
            tooltip: {
              signal: `${oneLineLabel(
                demographicType
              )} + ', ${measureDisplayName}: ' + datum.${tooltipMetricDisplayColumnName}`,
            },
          },
          update: {
            fill: { value: MEASURE_COLOR },
            x: { scale: 'x', field: measure },
            x2: { scale: 'x', value: 0 },
            y: { scale: 'y', field: demographicType },
            height: { scale: 'y', band: 1 },
          },
        },
      },
      {
        // ALT TEXT: invisible, verbose labels
        name: 'measure_a11y_text_labels',
        type: 'text',
        from: { data: DATASET },
        encode: {
          update: {
            y: { scale: 'y', field: demographicType, band: 0.8 },
            opacity: {
              signal: '0',
            },
            fontSize: { value: 0 },
            text: {
              signal: `${oneLineLabel(
                demographicType
              )} + ': ' + datum.${tooltipMetricDisplayColumnName} + ' ${measureDisplayName}'`,
            },
          },
        },
      },
      {
        name: 'measure_text_labels',
        type: 'text',
        style: ['text'],
        from: { data: DATASET },
        aria: false, // this data accessible in alt_text_labels
        encode: {
          enter: {
            tooltip: {
              signal: `${oneLineLabel(
                demographicType
              )} + ', ${measureDisplayName}: ' + datum.${tooltipMetricDisplayColumnName}`,
            },
          },
          update: {
            fontSize: { value: width > 250 ? 11 : 7.5 },
            align: {
              signal: `if(datum.${measure} > ${barLabelBreakpoint}, "right", "left")`,
            },
            baseline: { value: 'middle' },
            dx: {
              signal: `if(datum.${measure} > ${barLabelBreakpoint}, -5,${
                width > 250 ? '5' : '1'
              })`,
            },
            dy: {
              signal: chartIsSmall ? -15 : 0,
            },
            fill: {
              signal: `if(datum.${measure} > ${barLabelBreakpoint}, "white", "black")`,
            },
            x: { scale: 'x', field: measure },
            y: { scale: 'y', field: demographicType, band: 0.8 },
            limit: { signal: 'width / 3' },
            text: {
              signal: barLabel,
            },
          },
        },
      },
    ],
    scales: [
      {
        name: 'x',
        type: 'linear',
        // if all rows contain 0 or null, set full x range to 100%
        domainMax: onlyZeros ? 100 : undefined,
        domain: {
          data: DATASET,
          field: measure,
        },
        range: [0, { signal: 'width' }],
        nice: true,
        zero: true,
      },
      {
        name: 'y',
        type: 'band',
        domain: {
          data: DATASET,
          field: demographicType,
        },
        range: { step: { signal: 'y_step' } },
        paddingInner: BAR_PADDING,
      },
      {
        name: 'variables',
        type: 'ordinal',
        domain: [measureDisplayName],
        range: [MEASURE_COLOR],
      },
    ],
    axes: [
      {
        scale: 'x',
        orient: 'bottom',
        gridScale: 'y',
        grid: true,
        tickCount: { signal: 'ceil(width/40)' },
        domain: false,
        labels: false,
        aria: false,
        maxExtent: 0,
        minExtent: 0,
        ticks: false,
        zindex: ThemeZIndexValues.middle,
      },
      {
        scale: 'x',
        orient: 'bottom',
        grid: false,
        title: createAxisTitle(),
        titleX: chartIsSmall ? 0 : undefined,
        titleAnchor: chartIsSmall ? 'end' : 'null',
        titleAlign: chartIsSmall ? 'left' : 'center',
        labelFlush: true,
        labelOverlap: true,
        tickCount: { signal: 'ceil(width/40)' },
        zindex: ThemeZIndexValues.middle,
        titleLimit: { signal: 'width - 10 ' },
      },
      {
        scale: 'y',
        orient: 'left',
        grid: false,
        title: demographicTypeDisplayName,
        zindex: ThemeZIndexValues.middle,
        encode: {
          labels: {
            update: {
              text: { signal: MULTILINE_LABEL },
              baseline: { value: 'bottom' },
              // Limit at which line is truncated with an ellipsis
              limit: { value: 100 },
              dy: { signal: AXIS_LABEL_Y_DELTA },
              lineHeight: { signal: LABEL_HEIGHT },
            },
          },
        },
      },
    ],
    legends,
  }
}

interface SimpleHorizontalBarChartProps {
  data: Row[]
  metric: MetricConfig
  demographicType: DemographicType
  filename?: string
  usePercentSuffix?: boolean
}

export function SimpleHorizontalBarChart(props: SimpleHorizontalBarChartProps) {
  const [ref, width] = useResponsiveWidth()

  const altLabelMetrics = [...CAWP_METRICS, ...HIV_METRICS]

  // swap race labels if applicable
  const dataLabelled = altLabelMetrics.includes(props.metric.metricId)
    ? props.data.map((row: Row) => {
        const altRow = { ...row }
        altRow[props.demographicType] = getAltGroupLabel(
          row[props.demographicType],
          props.metric.metricId,
          props.demographicType
        )
        return altRow
      })
    : props.data

  const dataWithLineBreakDelimiter = addLineBreakDelimitersToField(
    dataLabelled,
    props.demographicType
  )
  const [dataWithDisplayCol, barMetricDisplayColumnName] =
    addMetricDisplayColumn(props.metric, dataWithLineBreakDelimiter)
  // Omit the % symbol for the tooltip because it's included in shortLabel.
  const [data, tooltipMetricDisplayColumnName] = addMetricDisplayColumn(
    props.metric,
    dataWithDisplayCol,
    /* omitPctSymbol= */ true
  )

  const barLabelBreakpoint =
    Math.max(...props.data.map((row) => row[props.metric.metricId])) *
    (LABEL_SWAP_CUTOFF_PERCENT / 100)

  return (
    <div ref={ref}>
      <Vega
        renderer='svg'
        downloadFileName={`${
          props.filename ?? 'Data Download'
        } - Health Equity Tracker`}
        spec={getSpec(
          /* altText  */ `Bar Chart showing ${
            props.filename ?? 'Data Download'
          }`,
          /* data  */ data,
          /* width  */ width,
          /* demographicType  */ props.demographicType,
          /* demographicTypeDisplayName  */ DEMOGRAPHIC_DISPLAY_TYPES_LOWER_CASE[
            props.demographicType
          ],
          /* measure  */ props.metric.metricId,
          /* measureDisplayName  */ props.metric.shortLabel,
          /* barMetricDisplayColumnName  */ barMetricDisplayColumnName,
          /* tooltipMetricDisplayColumnName  */ tooltipMetricDisplayColumnName,
          /* showLegend  */ false,
          /* barLabelBreakpoint  */ barLabelBreakpoint,
          /* usePercentSuffix  */ props.usePercentSuffix ?? false
        )}
        actions={false}
      />
    </div>
  )
}
