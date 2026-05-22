'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { MixingLatest } from '@/features/mixing/types/mixing'

interface Props {
  data: MixingLatest
}

export function MixingLeftContents({ data }: Props) {
  const rpms = data.mixer_rpms ?? [null, null]
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: '혼화 G값', value: data.g_value, unit: 's⁻¹' },
        { title: '응집 시간', value: data.mtcc_time, unit: 's' },
        { title: 'G·t 값', value: data.gt_value, unit: '', bigNumber: true },
      ]}
      states={[
        { label: '혼화기 #1 RPM', percent: rpms[0] },
        { label: '혼화기 #2 RPM', percent: rpms[1] },
      ]}
    />
  )
}
