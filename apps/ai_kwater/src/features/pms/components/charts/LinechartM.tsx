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
  series: SeriesItem[]
  title?: string
  yLabel?: string
  height?: number
}

const PALETTE = ['#5cafff', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#7dd3fc']

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_m.vue 의 multi line.
 * 다수 시리즈를 같은 yAxis 에 표시. spline 곡선 적용.
 */
export default function LinechartM({ series, title, yLabel, height = 260 }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'spline', height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: { title: { text: yLabel } },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series: series.map<Highcharts.SeriesSplineOptions>((s, i) => ({
      type: 'spline',
      name: s.name,
      data: s.data,
      color: s.color ?? PALETTE[i % PALETTE.length],
      lineWidth: 2,
    })),
  })

  return <BaseHighchart options={options} height={height} />
}
