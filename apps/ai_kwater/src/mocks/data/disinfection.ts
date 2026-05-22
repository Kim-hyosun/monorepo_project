import type {
  DisinfectionLatest,
  DisinfectionStage,
} from '@/features/disinfection/types/disinfection'

const now = Date.now()
const trend: Array<[number, number]> = Array.from({ length: 60 }, (_, i) => [
  now - (60 - i) * 60_000,
  1.1 + Math.sin(i / 6) * 0.12 + i * 0.002,
])

const baseStage = (offset: number): DisinfectionStage => ({
  cl_residual: Number((0.6 + offset).toFixed(2)),
  ai_cl_residual: Number((0.62 + offset).toFixed(2)),
  cl_dose: Number((1.1 + offset * 0.4).toFixed(2)),
  ai_cl_dose: Number((1.08 + offset * 0.4).toFixed(2)),
})

export const seedDisinfectionLatest: DisinfectionLatest = {
  update_time: new Date(now).toISOString(),
  operation_mode: 2,
  stages: {
    pre: baseStage(0),
    mid: baseStage(0.1),
    after: baseStage(0.2),
  },
  stages_sc: {
    pre: baseStage(0.05),
    mid: baseStage(0.15),
    after: baseStage(0.25),
  },
  ai_cl_dose_trend: trend,
  cl_pump_states: { pre: true, mid: true, after: true },
}
