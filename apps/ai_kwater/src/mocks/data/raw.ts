import type { RawLatest } from '@/features/raw/types/raw'

export const seedRawLatest: RawLatest = {
  update_time: new Date().toISOString(),
  r_in_tb: 3.2,
  r_in_al: 28.5,
  r_in_ph: 7.4,
  r_in_te: 18.2,
}
