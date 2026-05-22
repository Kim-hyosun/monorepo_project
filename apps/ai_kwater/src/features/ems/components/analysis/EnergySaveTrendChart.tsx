'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { AnalysisEnergyTrend } from '@/features/ems/types/ems'

interface Props {
  trend: AnalysisEnergyTrend
  height?: number
}

export default function EnergySaveTrendChart({ trend, height = 250 }: Props) {
  const toPoints = (arr: Array<number | null>): Array<[number, number | null]> =>
    arr.map((v, i) => [trend.startMs + i * trend.intervalMs, v])

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 70 },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d}' } },
    yAxis: [
      {
        title: { text: 'kWh' },
        gridLineColor: 'rgba(139, 194, 240, 0.1)',
        labels: { style: { color: '#c3eaff' } },
        opposite: false,
      },
      {
        title: { text: 'kWh/m³' },
        opposite: true,
        gridLineWidth: 0,
        labels: { style: { color: '#c3eaff' } },
      },
    ],
    series: [
      {
        type: 'line',
        name: '기준원단위(kWh/m³)',
        yAxis: 1,
        data: toPoints(trend.baseline),
        color: '#EDC976',
        dashStyle: 'LongDash',
        lineWidth: 2,
      },
      {
        type: 'line',
        name: '현재월단위(kWh/m³)',
        yAxis: 1,
        data: toPoints(trend.current),
        color: '#EF5656',
        dashStyle: 'LongDash',
        lineWidth: 2,
      },
      {
        type: 'area',
        name: '절감량(kWh)',
        yAxis: 0,
        data: toPoints(trend.saving),
        color: '#324478',
        fillOpacity: 0.5,
        lineWidth: 1,
      },
    ],
  })

  return (
    <BaseHighchart
      options={options}
      height={height}
      enableNavigator
      enableRangeSelector
      enableExport
    />
  )
}
