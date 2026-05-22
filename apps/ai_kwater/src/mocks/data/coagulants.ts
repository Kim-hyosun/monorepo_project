import type { CoagulantsLatest } from '@/features/coagulants/types/coagulants'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  35 + Math.sin(i / 6) * 5 + (i % 7),
])

export const seedCoagulantsLatest: CoagulantsLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  cg_dose: 38.2,
  cg_dose_sc: 39.5,
  ai_cg_dose: 37.6,
  ai_cg_dose_sc: 38.1,
  cg_density: 6.8,
  in_tb: 3.4,
  recommend_cg_dose: 37.9,
  ai_cg_dose_trend: trend,
  cg_residual: 0.45,
  cg_pump_states: [true, true, false, true],
}
