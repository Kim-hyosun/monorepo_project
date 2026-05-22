'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { MixingLatest } from '@/features/mixing/types/mixing'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: MixingLatest
}

export function MixingRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_g_value !== null && data.g_value !== null
      ? Number((data.ai_g_value - data.g_value).toFixed(0))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI G값 추천 트렌드'
      chart={
        data.ai_g_value_trend ? (
          <MiniDarkTrendChart data={data.ai_g_value_trend} yLabel='s⁻¹' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        {
          label: 'AI 추천 G값',
          value: data.ai_g_value,
          unit: 's⁻¹',
          delta: aiVsCurrent,
          digits: 0,
        },
        { label: 'AI 혼화기 RPM', value: data.ai_mixer_rpm, unit: 'rpm', digits: 0 },
      ]}
    />
  )
}
