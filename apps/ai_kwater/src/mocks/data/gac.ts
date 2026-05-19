import type { GacLatest } from '@/features/gac/types/gac'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  0.95 + Math.sin(i / 6) * 0.1 + i * 0.003,
])

export const seedGacLatest: GacLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  g_out_tb: 0.06,
  ai_g_out_tb: 0.05,
  g_loss_head: 0.98,
  ai_g_loss_head: 1.05,
  bw_interval: 48,
  ai_bw_interval: 44,
  g_running_count: 4,
  ai_g_loss_head_trend: trend,
}
