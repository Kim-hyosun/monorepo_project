'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Series {
  name: string
  data: Array<[number, number]>
  color?: string
}

interface Props {
  title?: string
  series: Series[]
  yLabel?: string
  height?: number
  enableExport?: boolean
}

const PALETTE = ['#5cafff', '#7dd3fc', '#fbbf24', '#f87171', '#a78bfa', '#34d399']

export default function PmsLineChart({ title, series, yLabel, height = 280, enableExport }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 56 : 40 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
    yAxis: { title: { text: yLabel } },
    series: series.map<Highcharts.SeriesLineOptions>((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      color: s.color ?? PALETTE[i % PALETTE.length],
      lineWidth: 2,
    })),
  })

  return <BaseHighchart options={options} height={height} enableExport={enableExport} />
}
