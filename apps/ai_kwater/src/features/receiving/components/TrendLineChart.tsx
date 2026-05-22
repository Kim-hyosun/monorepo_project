'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  title: string
  yLabel?: string
  dark?: boolean
}

const DARK_GRADIENT: Highcharts.GradientColorObject = {
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, 'rgba(92,175,255,0.4)'],
    [1, 'rgba(92,175,255,0)'],
  ],
}

const LIGHT_GRADIENT: Highcharts.GradientColorObject = {
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, 'rgba(59,130,246,0.24)'],
    [1, 'rgba(59,130,246,0)'],
  ],
}

const LIGHT_OPTIONS: Highcharts.Options = {
  chart: { backgroundColor: 'transparent', style: { fontFamily: 'inherit' } },
  credits: { enabled: false },
  accessibility: { enabled: false },
  exporting: { enabled: false },
  legend: { enabled: false },
  tooltip: { shared: true },
  plotOptions: { series: { animation: { duration: 200 }, marker: { enabled: false } } },
}

export default function TrendLineChart({ data, title, yLabel, dark }: Props) {
  const seriesColor = dark ? '#5cafff' : '#3b82f6'
  const fill = dark ? DARK_GRADIENT : LIGHT_GRADIENT

  const baseOptions: Highcharts.Options = {
    chart: { height: 280, marginTop: 50 },
    title: {
      text: title,
      style: dark ? { color: '#c3eaff', fontSize: '13px' } : { fontSize: '13px' },
      align: 'left',
    },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
    yAxis: { title: { text: yLabel } },
    series: [
      {
        type: 'area',
        name: title,
        data,
        color: seriesColor,
        lineWidth: 2,
        fillColor: fill,
      },
    ],
  }

  const options = dark
    ? mergeDark(baseDarkOptions(), baseOptions)
    : { ...LIGHT_OPTIONS, ...baseOptions }

  return <BaseHighchart options={options} height={280} />
}
