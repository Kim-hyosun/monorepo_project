'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Series {
  name: string
  data: Array<[number, number]>
  color?: string
  type?: 'line' | 'bar'
}

interface Props {
  title?: string
  series: Series[]
  yLabel?: string
  height?: number
  xAxisType?: 'time' | 'category'
  categories?: string[]
}

const PALETTE = ['#5cafff', '#7dd3fc', '#fbbf24', '#f87171', '#a78bfa', '#34d399']

export default function EmsLineChart({
  title,
  series,
  yLabel,
  height = 280,
  xAxisType = 'time',
  categories,
}: Props) {
  const seriesData = series.map<Highcharts.SeriesOptionsType>((s, i) => {
    const color = s.color ?? PALETTE[i % PALETTE.length]
    if (s.type === 'bar') {
      const data =
        xAxisType === 'category'
          ? s.data.map(([, y]) => y)
          : s.data.map<[number, number]>(([x, y]) => [x, y])
      return {
        type: 'column',
        name: s.name,
        data,
        color,
      } as Highcharts.SeriesColumnOptions
    }
    const data =
      xAxisType === 'category'
        ? s.data.map(([, y]) => y)
        : s.data.map<[number, number]>(([x, y]) => [x, y])
    return {
      type: 'line',
      name: s.name,
      data,
      color,
      lineWidth: 2,
    } as Highcharts.SeriesLineOptions
  })

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 56 : 40 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis:
      xAxisType === 'category'
        ? {
            type: 'category',
            categories: categories ?? [],
            labels: { style: { color: '#c3eaff' } },
          }
        : { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
    yAxis: { title: { text: yLabel } },
    series: seriesData,
  })

  return <BaseHighchart options={options} height={height} />
}
