/**
 * A Circle Chart that visualizes data trends over time
 * Uses d3.js to apply data transformations and draw circles on an SVG
 * @param {object[]} data array of timeseries data objects
 * @param {*} xScale a d3 time series scale function
 * @param {number} width the width of the svg
 * @param {string} groupLabel the label to apply to the legend title (e.g. 'race and ethnicity')
 * @param {boolean} isSkinny a flag to determine whether user is viewing app below the mobile breakpoint or with resulting card column in compare mode below mobile breakpoint
 * @param {string} selectedDate the date that is currently hovered
 * returns jsx of an svg group parent of many circle children distributed along an x-axis
 */

/* External Imports */
import { scaleSqrt, scaleLinear, extent, min, max } from 'd3'

/* Constants */
import {
  CONFIG,
  UNKNOWN_GROUP_COLOR_EXTENT,
  FORMATTERS as F,
} from './constants'
import { type UnknownData, type XScale } from './types'

/* Define type interface */
interface CircleChartProps {
  data: UnknownData
  xScale: XScale
  width: number
  groupLabel: string
  isSkinny: boolean
  selectedDate: string | null
  circleId: string
}

/* Render component */
export function CircleChart({
  data,
  xScale,
  width,
  groupLabel,
  isSkinny,
  selectedDate,
  circleId,
}: CircleChartProps) {
  /* Config */
  const { HEIGHT, MARGIN, RADIUS_EXTENT, MOBILE } = CONFIG
  const [, MAX_RADIUS] = RADIUS_EXTENT

  /* Scales */
  const percentDomain = data?.map(([_, percent]: [string, number]) => percent)
  const unknownGroupExtent: [number, number] | [undefined, undefined] =
    extent(percentDomain)

  // radius scale for circles
  const rScale = scaleSqrt(
    unknownGroupExtent as [number, number],
    isSkinny ? MOBILE.RADIUS_EXTENT : RADIUS_EXTENT
  )
  // color interpolation scale
  const colors = scaleLinear(
    unknownGroupExtent as [number, number],
    UNKNOWN_GROUP_COLOR_EXTENT
  )

  /* Memoized Values */
  const legendXPlacement = width / 2

  /* Helpers */
  function getLegendValues() {
    const maxPercent = max(percentDomain)
    const minPercent = min(percentDomain)
    const midPercent =
      maxPercent != null && minPercent != null
        ? minPercent + (maxPercent - minPercent) / 2
        : 0
    return [minPercent, midPercent, maxPercent]
  }

  const unknownCircleLegendText = `Legend: unknown ${groupLabel.toLowerCase()}`

  return (
    <g>
      <g
        tabIndex={0}
        role='list'
        aria-label={unknownCircleLegendText + ' per month'}
        transform={`translate(0, ${
          HEIGHT - MARGIN.bottom_with_unknowns + 4 * MAX_RADIUS
        })`}
      >
        {data?.map(([date, percent]: [string, number], i: number) => {
          const isEveryOtherBubble = i % 2 === 0
          const thisBubbleIsHovered = selectedDate === date
          const nothingIsHovered = !selectedDate

          return (
            <g
              role='listitem'
              key={`dataCircleGroup-${i}`}
              transform={`translate(${xScale(new Date(date)) ?? ''}, 0)`}
            >
              {/* return a circle for every data point on desktop, limited to every other on mobile (to create more space) and showing only the currently hovered bubble when hover state is active */}
              {(!isSkinny ||
                (isSkinny && isEveryOtherBubble) ||
                thisBubbleIsHovered) && (
                <>
                  {(thisBubbleIsHovered || nothingIsHovered) && (
                    <circle
                      r={rScale(percent)}
                      fill={colors(percent)}
                      role='img'
                      aria-label={date}
                    />
                  )}
                  {/* show percent % annotation on hover */}
                  <text
                    id={`circleText-${i}-${circleId}`}
                    className={
                      selectedDate === date
                        ? 'text-smallest transition-opacity delay-100 duration-200 ease-linear'
                        : 'opacity-0'
                    }
                    textAnchor={'middle'}
                    dy='26px'
                  >
                    {percent && F.pct(percent)} unknown
                  </text>
                </>
              )}
            </g>
          )
        })}
      </g>
      {/* Circle Legend */}
      <g
        // Translate into position (dynamic based on width & height alloted)
        transform={`translate(${legendXPlacement}, ${
          HEIGHT - 6.25 * MAX_RADIUS
        })`}
      >
        <g role='list' aria-label='Unknown Demographic Legend' tabIndex={0}>
          {/* Display circle for min, mid, and max values */}
          {getLegendValues().map((percent = 0, i) => {
            let legendHelper = ''
            if (i === 0) legendHelper = 'min '
            if (i === 1) legendHelper = 'mid '
            if (i === 2) legendHelper = 'max '

            return (
              <g
                key={`legendCircle-${i}`}
                transform={`translate(${(i - 1) * 6 * MAX_RADIUS}, 0)`}
                role='listitem'
              >
                {/* Legend circle */}
                <circle
                  r={rScale(percent)}
                  fill={colors(percent)}
                  role='presentation'
                >
                  <title>{`${legendHelper} unknown value`}</title>
                </circle>
                {/* Circle label annotation (percent represented by circle) */}
                <text
                  className='text-smallest'
                  textAnchor='middle'
                  dy='25px'
                  id={`circleLegendText-${i}-${circleId}`}
                  aria-label={`${legendHelper} unknown value indicator`}
                >
                  {F.pct(percent)}
                </text>
                <text className='text-smallest' textAnchor='middle' dy='36px'>
                  <tspan>{legendHelper}</tspan>
                </text>
              </g>
            )
          })}
        </g>

        {/* Legend Title */}
        <text
          textAnchor='middle'
          dy='55px'
          className='text-smallest font-medium'
          id={`unknown-circle-legend-title-${circleId}`}
        >
          {unknownCircleLegendText}
        </text>
      </g>
    </g>
  )
}
