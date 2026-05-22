import type { OzoneLatest } from '@/features/ozone/types/ozone'

export const seedOzoneLatest: OzoneLatest = {
  update_time: new Date().toISOString(),
  operation_mode: 2,
  oz_density: 0.45,
  oz_dose: 1.2,
  ai_oz_dose: 1.15,
  oz_residual: 0.18,
  oz_flow: 320,
  oz_generator_states: [true, false],
  oz_generator_load: 72,
}
