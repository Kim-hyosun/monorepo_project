'use client'

import Highcharts from 'highcharts'
import 'highcharts/modules/stock'
import 'highcharts/modules/drilldown'
import 'highcharts/modules/exporting'
import 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official'

interface Props {
  options: Highcharts.Options
  height?: number
  enableNavigator?: boolean
  enableRangeSelector?: boolean
  enableExport?: boolean
  /** export 시 파일명 (확장자 제외) */
  exportFilename?: string
  /** export 시 chart title (PNG/SVG/PDF 상단에 표기, xlsx sheet 명에 영향) */
  exportTitle?: string
}

const RANGE_BUTTONS: Highcharts.RangeSelectorButtonsOptions[] = [
  { type: 'month', count: 1, text: '1M' },
  { type: 'month', count: 3, text: '3M' },
  { type: 'month', count: 6, text: '6M' },
  { type: 'ytd', text: 'YTD' },
  { type: 'year', count: 1, text: '1Y' },
  { type: 'all', text: 'All' },
]

const NAVIGATOR_DARK: Highcharts.NavigatorOptions = {
  enabled: true,
  height: 36,
  margin: 12,
  maskFill: 'rgba(92,175,255,0.18)',
  outlineColor: '#5cafff66',
  handles: { backgroundColor: '#0c1933', borderColor: '#5cafff' },
  xAxis: {
    gridLineColor: 'rgba(139,194,240,0.1)',
    labels: { style: { color: '#c3eaff' } },
  },
  series: {
    type: 'areaspline',
    color: '#5cafff',
    fillOpacity: 0.25,
    lineWidth: 1,
  },
}

const RANGE_SELECTOR_DARK: Highcharts.RangeSelectorOptions = {
  enabled: true,
  buttons: RANGE_BUTTONS,
  buttonTheme: {
    fill: 'rgba(0,6,77,0.6)',
    stroke: '#5cafff66',
    'stroke-width': 1,
    r: 6,
    style: { color: '#c3eaff' },
    states: {
      hover: { fill: 'rgba(92,175,255,0.2)', style: { color: '#fff' } },
      select: { fill: '#5cafff', style: { color: '#0c1933' } },
    },
  },
  inputStyle: { color: '#c3eaff', backgroundColor: 'rgba(0,6,77,0.6)' },
  labelStyle: { color: '#c3eaff' },
  inputBoxBorderColor: '#5cafff66',
}

const EXPORT_DARK: Highcharts.ExportingOptions = {
  enabled: true,
  buttons: {
    contextButton: {
      symbolStroke: '#c3eaff',
      theme: { fill: 'transparent' },
      menuItems: [
        'viewFullscreen',
        'separator',
        'downloadPNG',
        'downloadSVG',
        'separator',
        'downloadCSV',
        'downloadXLS',
      ],
    },
  },
}

export default function BaseHighchart({
  options,
  height,
  enableNavigator,
  enableRangeSelector,
  enableExport,
  exportFilename,
  exportTitle,
}: Props) {
  const useStock = enableNavigator || enableRangeSelector
  const exportingMerged: Highcharts.ExportingOptions | undefined = enableExport
    ? {
        ...EXPORT_DARK,
        ...options.exporting,
        ...(exportFilename ? { filename: exportFilename } : {}),
        ...(exportTitle
          ? {
              chartOptions: {
                ...(options.exporting?.chartOptions ?? {}),
                title: { text: exportTitle, align: 'center' },
              },
            }
          : {}),
      }
    : { ...(options.exporting ?? {}), enabled: options.exporting?.enabled ?? false }

  const merged: Highcharts.Options = {
    ...options,
    chart: { ...options.chart, ...(height ? { height } : {}) },
    navigator: enableNavigator ? { ...NAVIGATOR_DARK, ...options.navigator } : { enabled: false },
    rangeSelector: enableRangeSelector
      ? { ...RANGE_SELECTOR_DARK, ...options.rangeSelector }
      : { enabled: false },
    scrollbar: enableNavigator ? { enabled: false, ...options.scrollbar } : { enabled: false },
    exporting: exportingMerged,
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={useStock ? 'stockChart' : undefined}
      options={merged}
      containerProps={{ style: { width: '100%', height: height ? `${height}px` : '100%' } }}
    />
  )
}
