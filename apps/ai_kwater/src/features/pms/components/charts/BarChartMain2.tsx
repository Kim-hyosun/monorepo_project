'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Bar {
  name: string
  value: number
  /** 추가 데이터(예: 경보 수) */
  secondary?: number
  color?: string
}

interface Props {
  bars: Bar[]
  title?: string
  height?: number
  xLabel?: string
}

const PRIMARY_COLOR = '#5cafff'
const SECONDARY_COLOR = '#f87171'

/**
 * 원본 성남정수장/components/pms/chart/dashboard/BarChart_main2.vue —
 * 가로형 막대 차트 (horizontal bar) + 보조 시리즈 (옵션).
 */
export default function BarChartMain2({ bars, title, height = 280, xLabel }: Props) {
  const hasSecondary = bars.some((b) => b.secondary !== undefined)

  const series: Highcharts.SeriesBarOptions[] = [
    {
      type: 'bar',
      name: '정상',
      color: PRIMARY_COLOR,
      data: bars.map((b) => b.value),
    },
  ]
  if (hasSecondary) {
    series.push({
      type: 'bar',
      name: '경보',
      color: SECONDARY_COLOR,
      data: bars.map((b) => b.secondary ?? 0),
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'bar', height, marginTop: title ? 48 : 24 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: {
      type: 'category',
      categories: bars.map((b) => b.name),
      labels: { style: { color: '#c3eaff', fontSize: '11px' } },
    },
    yAxis: { title: { text: xLabel }, min: 0 },
    legend: hasSecondary
      ? { itemStyle: { color: '#c3eaff', fontSize: '11px' } }
      : { enabled: false },
    plotOptions: { bar: { borderWidth: 0, stacking: hasSecondary ? 'normal' : undefined } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
