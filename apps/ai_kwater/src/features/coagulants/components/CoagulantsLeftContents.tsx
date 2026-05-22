'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { CoagulantsLatest } from '@/features/coagulants/types/coagulants'

interface Props {
  data: CoagulantsLatest
}

export function CoagulantsLeftContents({ data }: Props) {
  const states = (data.cg_pump_states ?? [null, null, null, null]).slice(0, 4)
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: '응집제 주입율', value: data.cg_dose, unit: 'mg/L', digits: 2 },
        { title: '잔류 응집제', value: data.cg_residual, unit: 'mg/L', digits: 2 },
        { title: 'AI 추천 주입율', value: data.recommend_cg_dose, unit: 'mg/L', digits: 2 },
      ]}
      states={states.map((on, i) => ({
        label: `응집제 펌프 #${i + 1}`,
        active: on === true,
      }))}
    />
  )
}
