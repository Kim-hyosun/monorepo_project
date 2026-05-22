'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { CoagulantsLatest } from '@/features/coagulants/types/coagulants'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: CoagulantsLatest
}

export function CoagulantsRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_cg_dose !== null && data.cg_dose !== null
      ? Number((data.ai_cg_dose - data.cg_dose).toFixed(2))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI 응집제 추천 트렌드'
      chart={
        data.ai_cg_dose_trend ? (
          <MiniDarkTrendChart data={data.ai_cg_dose_trend} yLabel='mg/L' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        { label: 'AI 추천', value: data.ai_cg_dose, unit: 'mg/L', delta: aiVsCurrent, digits: 2 },
        { label: '응집제 농도', value: data.cg_density, unit: '%', digits: 2 },
        { label: '유입 탁도', value: data.in_tb, unit: 'NTU', digits: 2 },
      ]}
    />
  )
}
