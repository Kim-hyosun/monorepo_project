'use client'

import { ProcessLeftContentsLayout } from '@/shared/components/ProcessLeftContentsLayout'
import type { DisinfectionLatest } from '@/features/disinfection/types/disinfection'

interface Props {
  data: DisinfectionLatest
}

export function DisinfectionLeftContents({ data }: Props) {
  const pumps = data.cl_pump_states ?? { pre: null, mid: null, after: null }
  return (
    <ProcessLeftContentsLayout
      values={[
        {
          title: '전염소 잔류',
          value: data.stages.pre.cl_residual,
          unit: 'mg/L',
          digits: 2,
        },
        {
          title: '중염소 잔류',
          value: data.stages.mid.cl_residual,
          unit: 'mg/L',
          digits: 2,
        },
        {
          title: '후염소 잔류',
          value: data.stages.after.cl_residual,
          unit: 'mg/L',
          digits: 2,
        },
      ]}
      states={[
        { label: '전염소 펌프', active: pumps.pre === true },
        { label: '중염소 펌프', active: pumps.mid === true },
        { label: '후염소 펌프', active: pumps.after === true },
      ]}
      rightColumns={3}
    />
  )
}
