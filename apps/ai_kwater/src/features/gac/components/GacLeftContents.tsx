'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { GacLatest } from '@/features/gac/types/gac'

interface Props {
  data: GacLatest
}

export function GacLeftContents({ data }: Props) {
  const states = (data.gac_states ?? Array(4).fill(null)).slice(0, 4)
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: 'GAC 출구 탁도', value: data.g_out_tb, unit: 'NTU', digits: 3 },
        { title: 'GAC 손실 수두', value: data.g_loss_head, unit: 'm', digits: 2 },
        { title: 'AI 역세 추천', value: data.ai_bw_interval, unit: 'h' },
      ]}
      states={states.map((on, i) => ({
        label: `GAC #${i + 1}`,
        active: on === true,
      }))}
    />
  )
}
