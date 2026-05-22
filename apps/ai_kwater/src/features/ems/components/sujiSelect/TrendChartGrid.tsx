'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SujiSelectData } from '@/features/ems/types/ems'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: SujiSelectData
}

const PALETTE = ['#5cafff', '#34d399', '#fbbf24', '#a78bfa', '#f87171', '#7dd3fc']

export function TrendChartGrid({ data }: Props) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {data.trends.map((t, i) => (
        <AioPanel key={t.key} className='p-3'>
          <h4 className='mb-1 text-xs font-semibold text-[var(--aio-subtitle)]'>{t.label}</h4>
          <EmsLineChart
            series={[
              {
                name: t.label,
                color: PALETTE[i % PALETTE.length],
                data: t.values.map<[number, number]>((v, idx) => [
                  data.startMs + idx * data.intervalMs,
                  v,
                ]),
              },
            ]}
            yLabel={t.unit}
            height={140}
          />
        </AioPanel>
      ))}
    </div>
  )
}
