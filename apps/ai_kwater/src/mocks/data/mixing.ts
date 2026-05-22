import type { MixingLatest } from '@/features/mixing/types/mixing'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  650 + Math.sin(i / 5) * 50 + i * 0.5,
])

export const seedMixingLatest: MixingLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  g_value: 680,
  g_value_sc: 720,
  ai_g_value: 695,
  ai_g_value_sc: 715,
  mtcc_time: 28,
  mixer_rpm: 145,
  ai_mixer_rpm: 142,
  ai_g_value_trend: trend,
  gt_value: 19_040,
  mixer_rpms: [148, 142],
}
