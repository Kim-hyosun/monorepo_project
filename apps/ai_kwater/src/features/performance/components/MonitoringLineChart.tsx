'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { PERFORMANCE_TYPE, type MonitoringPoint } from '@/features/performance/types/performance'

interface Props {
  data: MonitoringPoint[]
  enableExport?: boolean
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

export default function MonitoringLineChart({ data, enableExport }: Props) {
  const cpuPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.CPU)
  const memoryPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.MEMORY)
  const diskPoints = data.filter((p) => p.type === PERFORMANCE_TYPE.DISK)

  const categories = cpuPoints.map((p) => formatTimeLabel(p.timestamp))

  const options: Highcharts.Options = {
    chart: { height: 360, marginTop: 60, backgroundColor: 'transparent' },
    credits: { enabled: false },
    accessibility: { enabled: false },
    exporting: { enabled: false },
    title: {
      text: '리소스 사용률 (최근 1시간)',
      align: 'left',
      style: { fontSize: '14px' },
    },
    tooltip: { shared: true },
    legend: { align: 'left', verticalAlign: 'top' },
    xAxis: { type: 'category', categories },
    yAxis: { title: { text: undefined }, min: 0, max: 100 },
    plotOptions: { series: { animation: { duration: 200 }, marker: { enabled: false } } },
    series: [
      {
        type: 'line',
        name: TYPE_LABELS[PERFORMANCE_TYPE.CPU],
        data: cpuPoints.map((p) => p.value),
        color: '#3b82f6',
        lineWidth: 2,
      },
      {
        type: 'line',
        name: TYPE_LABELS[PERFORMANCE_TYPE.MEMORY],
        data: memoryPoints.map((p) => p.value),
        color: '#22c55e',
        lineWidth: 2,
      },
      {
        type: 'line',
        name: TYPE_LABELS[PERFORMANCE_TYPE.DISK],
        data: diskPoints.map((p) => p.value),
        color: '#f59e0b',
        lineWidth: 2,
      },
    ],
  }

  return <BaseHighchart options={options} height={360} enableExport={enableExport} />
}
