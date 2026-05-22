'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { SedimentationLatest } from '@/features/sedimentation/types/sedimentation'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: SedimentationLatest
}

export function SedimentationRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_e_out_tb !== null && data.e_out_tb !== null
      ? Number((data.ai_e_out_tb - data.e_out_tb).toFixed(2))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI 침전 탁도 예측 트렌드'
      chart={
        data.ai_e_out_tb_trend ? (
          <MiniDarkTrendChart data={data.ai_e_out_tb_trend} color='#34d399' yLabel='NTU' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        {
          label: 'AI 예측 탁도',
          value: data.ai_e_out_tb,
          unit: 'NTU',
          delta: aiVsCurrent,
          digits: 2,
        },
        { label: '슬러지 농도', value: data.sd_density, unit: '%', digits: 2 },
        { label: 'AI 추천 배출주기', value: data.ai_sd_purge_interval, unit: 'min', digits: 0 },
      ]}
    />
  )
}
