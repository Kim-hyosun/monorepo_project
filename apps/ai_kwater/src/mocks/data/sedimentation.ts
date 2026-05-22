import type { SedimentationLatest } from '@/features/sedimentation/types/sedimentation'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  0.6 + Math.sin(i / 7) * 0.15 + (i % 5) * 0.01,
])
const predictTrend: Array<[number, number]> = Array.from({ length: 30 }, (_, i) => [
  now + i * 60_000,
  0.58 + Math.sin(i / 5) * 0.1,
])
const densityTrend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  10 + Math.sin(i / 6) * 2 + i * 0.04,
])

const HOUR = 3_600_000
const purgeSchedule: SedimentationLatest['purge_schedule'] = [
  { line: 1, label: '침전지 #1', start: now - 4 * HOUR, end: now - 3.5 * HOUR, state: 'done' },
  { line: 1, label: '침전지 #1', start: now + 1 * HOUR, end: now + 1.5 * HOUR, state: 'scheduled' },
  { line: 2, label: '침전지 #2', start: now - 2 * HOUR, end: now - 1.5 * HOUR, state: 'done' },
  { line: 2, label: '침전지 #2', start: now - 0.2 * HOUR, end: now + 0.3 * HOUR, state: 'active' },
  { line: 3, label: '침전지 #3', start: now + 2 * HOUR, end: now + 2.5 * HOUR, state: 'scheduled' },
]

export const seedSedimentationLatest: SedimentationLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  e_out_tb: 0.72,
  e_out_tb_sc: 0.68,
  ai_e_out_tb: 0.69,
  ai_e_out_tb_sc: 0.65,
  sd_time: 95,
  sd_density: 12.4,
  sd_purge_interval: 120,
  ai_sd_purge_interval: 110,
  ai_e_out_tb_trend: trend,
  sludge_valves: [42, 18, 0],
  ai_e_out_tb_predict: predictTrend,
  sd_density_trend: densityTrend,
  purge_schedule: purgeSchedule,
}
