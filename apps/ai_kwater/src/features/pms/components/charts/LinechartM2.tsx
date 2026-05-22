'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface SeriesItem {
  name: string
  data: Array<[number, number]>
  color?: string
}

interface Props {
  /** 좌측 axis 시리즈 */
  primarySeries: SeriesItem[]
  /** 우측 axis 시리즈 (옵션) */
  secondarySeries?: SeriesItem[]
  title?: string
  primaryYLabel?: string
  secondaryYLabel?: string
  height?: number
}

const PALETTE_LEFT = ['#5cafff', '#7dd3fc', '#a78bfa']
const PALETTE_RIGHT = ['#fbbf24', '#f87171', '#fb923c']

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_m2.vue —
 * multi-line 이중축. 좌측은 spline, 우측은 line.
 */
export default function LinechartM2({
  primarySeries,
  secondarySeries = [],
  title,
  primaryYLabel,
  secondaryYLabel,
  height = 280,
}: Props) {
  const series: Highcharts.SeriesOptionsType[] = [
    ...primarySeries.map<Highcharts.SeriesSplineOptions>((s, i) => ({
      type: 'spline',
      name: s.name,
      data: s.data,
      yAxis: 0,
      color: s.color ?? PALETTE_LEFT[i % PALETTE_LEFT.length],
      lineWidth: 2,
    })),
    ...secondarySeries.map<Highcharts.SeriesLineOptions>((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      yAxis: 1,
      color: s.color ?? PALETTE_RIGHT[i % PALETTE_RIGHT.length],
      lineWidth: 2,
      dashStyle: 'Dot',
    })),
  ]

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: [
      { title: { text: primaryYLabel } },
      {
        opposite: true,
        title: { text: secondaryYLabel },
        gridLineWidth: 0,
      },
    ],
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
