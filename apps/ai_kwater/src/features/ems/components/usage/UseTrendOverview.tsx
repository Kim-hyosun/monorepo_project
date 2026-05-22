'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import type { UseTrendData } from '@/features/ems/types/ems'

const MultiSeriesLineChart = dynamic(
  () => import('@/features/ems/components/usage/MultiSeriesLineChart'),
  { ssr: false, loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div> },
)
const CategoryBarChart = dynamic(
  () => import('@/features/ems/components/usage/CategoryBarChart'),
  { ssr: false, loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div> },
)

interface Props {
  data: UseTrendData
}

export function UseTrendOverview({ data }: Props) {
  return (
    <div className='grid grid-cols-12 gap-3'>
      <AioPanel className='col-span-8 p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>전력 사용량</h3>
        <MultiSeriesLineChart
          startMs={data.startMs}
          intervalMs={data.intervalMs}
          series={data.powerUsed}
          yLabel='kWh'
          height={240}
          type='area'
        />
      </AioPanel>
      <AioPanel className='col-span-4 p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>최대 피크 현황</h3>
        <CategoryBarChart items={data.powerPeak} height={240} yLabel='kW' />
      </AioPanel>
    </div>
  )
}
