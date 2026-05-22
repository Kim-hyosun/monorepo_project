'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  /** 상/하 임계선 */
  upperThreshold?: number | null
  lowerThreshold?: number | null
  title?: string
  yLabel?: string
  color?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d2.vue —
 * dashed line + 상/하 이중 임계선.
 */
export default function LinechartD2({
  data,
  upperThreshold = null,
  lowerThreshold = null,
  title,
  yLabel,
  color = '#FF4369',
  height = 240,
}: Props) {
  const plotLines: Highcharts.YAxisPlotLinesOptions[] = []
  if (upperThreshold !== null) {
    plotLines.push({
      value: upperThreshold,
      color: '#f00',
      width: 1.5,
      dashStyle: 'Dash',
      label: { text: '상한', style: { color: '#f00' }, align: 'right', x: -6 },
    })
  }
  if (lowerThreshold !== null) {
    plotLines.push({
      value: lowerThreshold,
      color: '#fbbf24',
      width: 1.5,
      dashStyle: 'Dash',
      label: { text: '하한', style: { color: '#fbbf24' }, align: 'right', x: -6, y: 14 },
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: { title: { text: yLabel }, plotLines: plotLines.length > 0 ? plotLines : undefined },
    legend: { enabled: false },
    series: [
      {
        type: 'line',
        name: title ?? 'value',
        data,
        color,
        lineWidth: 2,
        dashStyle: 'Dash',
        marker: { enabled: true, radius: 3, symbol: 'circle' },
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
