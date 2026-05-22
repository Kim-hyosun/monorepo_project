'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { FilterLatest } from '@/features/filter/types/filter'

interface Props {
  data: FilterLatest
}

export function FilterLeftContents({ data }: Props) {
  const states = (data.f_states ?? Array(6).fill(null)).slice(0, 6)
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: '여과 손실 수두', value: data.f_loss_head, unit: 'm', digits: 2 },
        { title: '여과 출구 탁도', value: data.f_out_tb, unit: 'NTU', digits: 2 },
        { title: '운영중 여과지', value: data.f_running_count, unit: '기' },
      ]}
      states={states.map((on, i) => ({
        label: `여과지 #${i + 1}`,
        active: on === true,
      }))}
      rightColumns={3}
    />
  )
}
