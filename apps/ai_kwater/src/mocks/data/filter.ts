import type { FilterLatest, FilterScheduleEntry } from '@/features/filter/types/filter'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  1.2 + Math.sin(i / 7) * 0.2 + i * 0.005,
])
const waterLevelTrend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  3.5 + Math.sin(i / 8) * 0.4,
])
const HOUR = 3_600_000
const aiRecommendBands = [
  { from: now + 0.5 * HOUR, to: now + 1 * HOUR, label: 'AI 추천 #1' },
  { from: now + 3 * HOUR, to: now + 3.5 * HOUR, label: 'AI 추천 #2' },
  { from: now + 6 * HOUR, to: now + 6.5 * HOUR, label: 'AI 추천 #3' },
]

const schedule: FilterScheduleEntry[] = Array.from({ length: 6 }, (_, i) => ({
  filter_no: i + 1,
  start: new Date(now + i * 3_600_000).toISOString(),
  end: new Date(now + i * 3_600_000 + 30 * 60_000).toISOString(),
  next_end: new Date(now + (i + 1) * 3_600_000 + 30 * 60_000).toISOString(),
}))

export const seedFilterLatest: FilterLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  f_loss_head: 1.34,
  f_loss_head_sc: 1.28,
  ai_f_loss_head: 1.42,
  ai_f_loss_head_sc: 1.38,
  bw_interval: 24,
  ai_bw_interval: 22,
  f_out_tb: 0.08,
  f_running_count: 5,
  schedule,
  ai_f_loss_head_trend: trend,
  f_states: [true, true, true, true, true, false],
  f_water_level_trend: waterLevelTrend,
  ai_recommend_bands: aiRecommendBands,
}
