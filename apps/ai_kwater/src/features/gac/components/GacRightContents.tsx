'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { GacLatest } from '@/features/gac/types/gac'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: GacLatest
}

export function GacRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_g_loss_head !== null && data.g_loss_head !== null
      ? Number((data.ai_g_loss_head - data.g_loss_head).toFixed(2))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI GAC 손실수두 예측 트렌드'
      chart={
        data.ai_g_loss_head_trend ? (
          <MiniDarkTrendChart data={data.ai_g_loss_head_trend} color='#a78bfa' yLabel='m' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        {
          label: 'AI 예측 손실수두',
          value: data.ai_g_loss_head,
          unit: 'm',
          delta: aiVsCurrent,
          digits: 2,
        },
        { label: 'AI 추천 역세', value: data.ai_bw_interval, unit: 'h', digits: 0 },
        { label: 'AI 출구 탁도 예측', value: data.ai_g_out_tb, unit: 'NTU', digits: 3 },
      ]}
    />
  )
}
