import type { ReceivingLatest } from '@/features/receiving/types/receiving'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  3500 + Math.sin(i / 5) * 200 + i * 1.2,
])

export const seedReceivingLatest: ReceivingLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  ems_mode: 1,
  h_target_le_max: 5.0,
  h_target_le_min: 2.5,
  b_in_fr_i: 3650,
  b_in_fr_i_sc: 4120,
  b1_vv_po: 72,
  b1_vv_po_sc: 68,
  h_location_le1: 4.32,
  h_location_le1_sc: 4.18,
  ai_b1_in_fr: 3680,
  ai_b_in_fr_trend: trend,
}
