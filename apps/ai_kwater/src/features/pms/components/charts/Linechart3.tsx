'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  title?: string
  yLabel?: string
  color?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart3.vue — area trend.
 */
export default function Linechart3({
  data,
  title,
  yLabel,
  color = '#fb923c',
  height = 220,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'area', height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: { title: { text: yLabel } },
    legend: { enabled: false },
    plotOptions: { area: { fillOpacity: 0.45, marker: { enabled: false } } },
    series: [
      {
        type: 'area',
        name: title ?? 'value',
        data,
        color,
        lineWidth: 2,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${color}80`],
            [1, `${color}00`],
          ],
        },
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
