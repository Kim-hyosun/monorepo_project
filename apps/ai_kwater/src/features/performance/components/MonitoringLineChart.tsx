'use client'

import ReactECharts from 'echarts-for-react'

import { PERFORMANCE_TYPE, type MonitoringPoint } from '@/features/performance/types/performance'

interface Props {
  data: MonitoringPoint[]
}

const TYPE_LABELS: Record<number, string> = {
  [PERFORMANCE_TYPE.CPU]: 'CPU (%)',
  [PERFORMANCE_TYPE.MEMORY]: 'Memory (%)',
  [PERFORMANCE_TYPE.DISK]: 'Disk (%)',
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatTimeLabel(ts: string): string {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function MonitoringLineChart({ data }: Props) {
  const cpuPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.CPU)
  const memoryPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.MEMORY)
  const diskPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.DISK)

  const xAxis = cpuPoints.map((p) => formatTimeLabel(p.timestamp))

  const option = {
    title: { text: '리소스 사용률 (최근 1시간)', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' as const },
    legend: { data: Object.values(TYPE_LABELS) },
    grid: { left: 50, right: 30, top: 50, bottom: 30 },
    xAxis: { type: 'category' as const, data: xAxis },
    yAxis: { type: 'value' as const, min: 0, max: 100 },
    series: [
      {
        name: TYPE_LABELS[PERFORMANCE_TYPE.CPU],
        type: 'line' as const,
        smooth: true,
        data: cpuPoints.map((p) => p.value),
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: TYPE_LABELS[PERFORMANCE_TYPE.MEMORY],
        type: 'line' as const,
        smooth: true,
        data: memoryPoints.map((p) => p.value),
        itemStyle: { color: '#22c55e' },
      },
      {
        name: TYPE_LABELS[PERFORMANCE_TYPE.DISK],
        type: 'line' as const,
        smooth: true,
        data: diskPoints.map((p) => p.value),
        itemStyle: { color: '#f59e0b' },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} />
}
