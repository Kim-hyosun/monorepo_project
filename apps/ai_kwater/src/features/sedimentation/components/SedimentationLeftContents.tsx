'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { SedimentationLatest } from '@/features/sedimentation/types/sedimentation'

interface Props {
  data: SedimentationLatest
}

export function SedimentationLeftContents({ data }: Props) {
  const valves = (data.sludge_valves ?? [null, null, null]).slice(0, 3)
  return (
    <ProcessLeftContentsLayout
      values={[
        { title: '침전지 출구 탁도', value: data.e_out_tb, unit: 'NTU', digits: 2 },
        { title: '침전 시간', value: data.sd_time, unit: 'min' },
        { title: '슬러지 배출 주기', value: data.sd_purge_interval, unit: 'min' },
      ]}
      states={valves.map((v, i) => ({
        label: `슬러지 밸브 #${i + 1}`,
        percent: v,
      }))}
      rightColumns={3}
    />
  )
}
