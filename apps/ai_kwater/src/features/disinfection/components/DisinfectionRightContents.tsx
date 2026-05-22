'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { DisinfectionLatest } from '@/features/disinfection/types/disinfection'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: DisinfectionLatest
}

export function DisinfectionRightContents({ data }: Props) {
  const after = data.stages.after
  const aiVsCurrent =
    after.ai_cl_dose !== null && after.cl_dose !== null
      ? Number((after.ai_cl_dose - after.cl_dose).toFixed(2))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI 후염소 주입율 추천 트렌드'
      chart={
        data.ai_cl_dose_trend ? (
          <MiniDarkTrendChart data={data.ai_cl_dose_trend} color='#7dd3fc' yLabel='mg/L' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        { label: '전염소 AI 예측', value: data.stages.pre.ai_cl_residual, unit: 'mg/L', digits: 2 },
        { label: '중염소 AI 예측', value: data.stages.mid.ai_cl_residual, unit: 'mg/L', digits: 2 },
        {
          label: '후염소 AI 예측',
          value: data.stages.after.ai_cl_residual,
          unit: 'mg/L',
          digits: 2,
        },
        {
          label: '후염소 AI 주입',
          value: after.ai_cl_dose,
          unit: 'mg/L',
          delta: aiVsCurrent,
          digits: 2,
        },
      ]}
    />
  )
}
