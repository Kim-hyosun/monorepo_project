import type {
  MonitoringLatestEntry,
  MonitoringPoint,
  ResourceInfo,
} from '@/features/performance/types/performance'

import { PERFORMANCE_TYPE } from '@/features/performance/types/performance'

export const seedResources: ResourceInfo[] = [
  {
    systemInfo: {
      hostname: 'aio-node-01',
      name: '메인 분석 서버',
      cpu_model: 'Intel Xeon Silver 4210',
      cpu_cores: 10,
      memory_total: 64 * 1024,
      os: 'Ubuntu 22.04 LTS',
    },
  },
  {
    systemInfo: {
      hostname: 'aio-node-02',
      name: '시각화 서버',
      cpu_model: 'Intel Xeon Silver 4210',
      cpu_cores: 10,
      memory_total: 32 * 1024,
      os: 'Ubuntu 22.04 LTS',
    },
  },
]

function buildSeries(seed: number): MonitoringPoint[] {
  const now = Date.now()
  const points: MonitoringPoint[] = []
  for (let i = 0; i < 60; i++) {
    const ts = new Date(now - (60 - i) * 60_000).toISOString()
    points.push(
      { timestamp: ts, type: PERFORMANCE_TYPE.CPU, value: 20 + ((seed + i) % 50) },
      { timestamp: ts, type: PERFORMANCE_TYPE.MEMORY, value: 40 + ((seed * 2 + i) % 35) },
      { timestamp: ts, type: PERFORMANCE_TYPE.DISK, value: 55 + ((seed + i * 2) % 20) },
    )
  }
  return points
}

export const seedMonitoringByHost: Record<string, MonitoringPoint[]> = {
  'aio-node-01': buildSeries(3),
  'aio-node-02': buildSeries(11),
}

export const seedMonitoringLatest: MonitoringLatestEntry[] = seedResources.flatMap((r) => {
  const series = seedMonitoringByHost[r.systemInfo.hostname]
  const last = series[series.length - 1]
  return [
    {
      hostname: r.systemInfo.hostname,
      type: PERFORMANCE_TYPE.CPU,
      value: series.filter((p) => p.type === PERFORMANCE_TYPE.CPU).at(-1)?.value ?? 0,
      timestamp: last.timestamp,
    },
    {
      hostname: r.systemInfo.hostname,
      type: PERFORMANCE_TYPE.MEMORY,
      value: series.filter((p) => p.type === PERFORMANCE_TYPE.MEMORY).at(-1)?.value ?? 0,
      timestamp: last.timestamp,
    },
    {
      hostname: r.systemInfo.hostname,
      type: PERFORMANCE_TYPE.DISK,
      value: series.filter((p) => p.type === PERFORMANCE_TYPE.DISK).at(-1)?.value ?? 0,
      timestamp: last.timestamp,
    },
  ]
})
