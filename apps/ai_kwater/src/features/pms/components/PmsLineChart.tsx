'use client'

import ReactECharts from 'echarts-for-react'

interface Series {
  name: string
  data: Array<[number, number]>
  color?: string
}

interface Props {
  title?: string
  series: Series[]
  yLabel?: string
  height?: number
}

const PALETTE = ['#5cafff', '#7dd3fc', '#fbbf24', '#f87171', '#a78bfa', '#34d399']

export default function PmsLineChart({ title, series, yLabel, height = 280 }: Props) {
  const option = {
    backgroundColor: 'transparent',
    title: title
      ? { text: title, textStyle: { fontSize: 13, color: '#c3eaff' } }
      : undefined,
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(0,6,77,0.85)',
      borderColor: '#5cafff',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: series.map((s) => s.name),
      textStyle: { color: '#c3eaff' },
      top: title ? 24 : 0,
    },
    grid: { left: 60, right: 30, top: title ? 56 : 36, bottom: 30 },
    xAxis: {
      type: 'time' as const,
      axisLine: { lineStyle: { color: '#5cafff88' } },
      axisLabel: { color: '#c3eaff' },
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
    series: series.map((s, i) => ({
      name: s.name,
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      data: s.data,
      itemStyle: { color: s.color ?? PALETTE[i % PALETTE.length] },
      lineStyle: { width: 2 },
    })),
  }
  return <ReactECharts option={option} style={{ height, width: '100%' }} />
}
