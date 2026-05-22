'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { OzoneLatest } from '@/features/ozone/types/ozone'

interface Props {
  data: OzoneLatest
}

export function OzoneLeftContents({ data }: Props) {
  const gens = (data.oz_generator_states ?? [null, null]).slice(0, 2)
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: '오존 주입율', value: data.oz_dose, unit: 'mg/L', digits: 2 },
        { title: '오존 잔류량', value: data.oz_residual, unit: 'mg/L', digits: 2 },
        { title: '처리량', value: data.oz_flow, unit: 'm³/h' },
      ]}
      states={[
        { label: '오존 발생기 #1', active: gens[0] === true },
        { label: '오존 발생기 #2', active: gens[1] === true },
        { label: '발생기 부하', percent: data.oz_generator_load },
      ]}
      rightColumns={3}
    />
  )
}
