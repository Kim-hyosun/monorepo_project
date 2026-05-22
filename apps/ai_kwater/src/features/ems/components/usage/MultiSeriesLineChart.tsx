'use client'

import ReactECharts from 'echarts-for-react'

import type { ChartTrendSeries } from '@/features/ems/types/ems'

interface Props {
  startMs: number
  intervalMs: number
  series: ChartTrendSeries[]
  yLabel?: string
  height?: number
  type?: 'line' | 'area'
}

export default function MultiSeriesLineChart({
  startMs,
  intervalMs,
  series,
  yLabel,
  height = 240,
  type = 'line',
}: Props) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(0,6,77,0.85)',
      borderColor: '#5cafff',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: series.map((s) => s.name),
      textStyle: { color: '#c3eaff', fontSize: 10 },
      top: 0,
      type: 'scroll' as const,
    },
    grid: { left: 55, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'time' as const,
      axisLine: { lineStyle: { color: '#5cafff88' } },
      axisLabel: { color: '#c3eaff', formatter: '{MM}-{dd}' },
      splitLine: { lineStyle: { color: 'rgba(139, 194, 240, 0.1)' } },
    },
    yAxis: {
      type: 'value' as const,
      name: yLabel,
      nameTextStyle: { color: '#c3eaff' },
      axisLine: { lineStyle: { color: '#5cafff88' } },
      axisLabel: { color: '#c3eaff' },
      splitLine: { lineStyle: { color: 'rgba(139, 194, 240, 0.1)' } },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      areaStyle: type === 'area' ? { opacity: 0.4 } : undefined,
      lineStyle: { width: 2 },
      itemStyle: { color: s.color },
      data: s.data.map<[number, number]>((v, i) => [startMs + i * intervalMs, v]),
    })),
  }
  return <ReactECharts option={option} style={{ height, width: '100%' }} />
}
