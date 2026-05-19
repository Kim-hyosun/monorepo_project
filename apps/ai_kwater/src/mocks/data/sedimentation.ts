import type { SedimentationLatest } from '@/features/sedimentation/types/sedimentation'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  0.6 + Math.sin(i / 7) * 0.15 + (i % 5) * 0.01,
])

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
}
