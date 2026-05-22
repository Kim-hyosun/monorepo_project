'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SujiSelect2Data } from '@/features/ems/types/ems'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  data: SujiSelect2Data
}

export function LevelTrendChart({ data }: Props) {
  const { selected, selectedTrend } = data
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>
        수위 트렌드 <span className='ml-2 text-white'>{selected}</span>
      </h3>
      <EmsLineChart
        series={[
          {
            name: `${selected} 수위`,
            color: '#5cafff',
            data: selectedTrend.levels.map<[number, number]>((v, i) => [
              selectedTrend.startMs + i * selectedTrend.intervalMs,
              v,
            ]),
          },
        ]}
        yLabel='m'
        height={260}
      />
    </AioPanel>
  )
}
