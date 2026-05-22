'use client'

import dynamic from 'next/dynamic'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { FilterLatest } from '@/features/filter/types/filter'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: FilterLatest
}

export function FilterRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_f_loss_head !== null && data.f_loss_head !== null
      ? Number((data.ai_f_loss_head - data.f_loss_head).toFixed(2))
      : null
  const nextSchedule = data.schedule?.[0]

  return (
    <ProcessRightContentsLayout
      title='AI 손실 수두 예측 트렌드'
      chart={
        data.ai_f_loss_head_trend ? (
          <MiniDarkTrendChart data={data.ai_f_loss_head_trend} color='#fbbf24' yLabel='m' />
        ) : (
          <div className='text-xs text-[var(--aio-subtitle)]'>트렌드 데이터 없음</div>
        )
      }
      kpis={[
        {
          label: 'AI 예측 손실수두',
          value: data.ai_f_loss_head,
          unit: 'm',
          delta: aiVsCurrent,
          digits: 2,
        },
        { label: 'AI 추천 역세', value: data.ai_bw_interval, unit: 'h', digits: 0 },
        { label: '여과 출구 탁도', value: data.f_out_tb, unit: 'NTU', digits: 2 },
      ]}
      footer={
        nextSchedule ? (
          <div className='mt-3 rounded border border-[var(--aio-panel-border)] bg-black/30 p-2 text-xs'>
            <div className='text-[var(--aio-subtitle)]'>다음 역세 일정</div>
            <div className='mt-0.5 flex items-center justify-between text-white'>
              <span>여과지 #{nextSchedule.filter_no}</span>
              <span className='text-[10px] text-[var(--aio-subtitle)]'>
                {formatTime(nextSchedule.start)}
              </span>
            </div>
          </div>
        ) : null
      }
    />
  )
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
