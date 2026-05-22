'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 4 시리즈 dashed line — 모터 4 채널 비교용 */
  series: Array<{ name: string; data: Array<[number, number]>; color?: string }>
  title?: string
  yLabel?: string
  height?: number
}

const PALETTE = ['#5cafff', '#34d399', '#fbbf24', '#f87171']

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d4.vue —
 * 4 시리즈 dashed line (모터 DE/NDE + 펌프 DE/NDE 비교).
 */
export default function LinechartD4({ series, title, yLabel, height = 280 }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: { title: { text: yLabel } },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series: series.map<Highcharts.SeriesLineOptions>((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      color: s.color ?? PALETTE[i % PALETTE.length],
      lineWidth: 2,
      dashStyle: 'Dash',
    })),
  })

  return <BaseHighchart options={options} height={height} />
}
