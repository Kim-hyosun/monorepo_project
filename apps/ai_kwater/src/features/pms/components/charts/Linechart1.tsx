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
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart1.vue — 기본 단일 line.
 */
export default function Linechart1({
  data,
  title,
  yLabel,
  color = '#5cafff',
  height = 220,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: { title: { text: yLabel } },
    legend: { enabled: false },
    series: [
      {
        type: 'line',
        name: title ?? 'value',
        data,
        color,
        lineWidth: 2,
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
