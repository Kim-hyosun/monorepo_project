'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ChartTrendSeries } from '@/features/ems/types/ems'

interface Props {
  startMs: number
  intervalMs: number
  series: ChartTrendSeries[]
  yLabel?: string
  height?: number
  type?: 'line' | 'area'
  enableExport?: boolean
}

export default function MultiSeriesLineChart({
  startMs,
  intervalMs,
  series,
  yLabel,
  height = 240,
  type = 'line',
  enableExport,
}: Props) {
  const isArea = type === 'area'

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 30 },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d}' } },
    yAxis: { title: { text: yLabel } },
    legend: {
      itemStyle: { color: '#c3eaff', fontSize: '10px' },
      align: 'left',
      verticalAlign: 'top',
    },
    series: series.map<Highcharts.SeriesOptionsType>((s) => {
      const data = s.data.map<[number, number]>((v, i) => [startMs + i * intervalMs, v])
      if (isArea) {
        return {
          type: 'area',
          name: s.name,
          data,
          color: s.color,
          lineWidth: 2,
          fillOpacity: 0.4,
        } as Highcharts.SeriesAreaOptions
      }
      return {
        type: 'line',
        name: s.name,
        data,
        color: s.color,
        lineWidth: 2,
      } as Highcharts.SeriesLineOptions
    }),
  })

  return <BaseHighchart options={options} height={height} enableExport={enableExport} />
}
