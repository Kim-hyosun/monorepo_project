'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { PumpPerformData } from '@/features/ems/types/ems'

interface Props {
  data: PumpPerformData
  height?: number
}

export default function HzTrendLineChart({ data, height = 180 }: Props) {
  const toPoints = (values: number[]): Array<[number, number]> =>
    values.map((v, i) => [data.startMs + i * data.intervalMs, v])

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'line', height, marginTop: 40 },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d}' } },
    yAxis: { title: { text: 'Hz' }, max: 60 },
    series: data.hzTrend.map<Highcharts.SeriesLineOptions>((s) => ({
      type: 'line',
      name: s.name,
      data: toPoints(s.data),
      color: s.color,
      lineWidth: 2,
    })),
  })

  return <BaseHighchart options={options} height={height} />
}
