'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ZoneUsageData } from '@/features/ems/types/ems'

const CategoryPieChart = dynamic(
  () => import('@/features/ems/components/usage/CategoryPieChart'),
  { ssr: false, loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div> },
)
const CategoryBarChart = dynamic(
  () => import('@/features/ems/components/usage/CategoryBarChart'),
  { ssr: false, loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div> },
)
const MultiSeriesLineChart = dynamic(
  () => import('@/features/ems/components/usage/MultiSeriesLineChart'),
  { ssr: false, loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div> },
)

interface Props {
  data: ZoneUsageData
}

export function ZoneSummaryCharts({ data }: Props) {
  return (
    <div className='grid grid-cols-12 gap-3'>
      <AioPanel className='col-span-3 p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>합계</h3>
        <CategoryPieChart items={data.sumChart} height={200} />
      </AioPanel>
      <AioPanel className='col-span-3 p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>분포도</h3>
        <CategoryBarChart items={data.distributionChart} height={200} yLabel='kW' />
      </AioPanel>
      <AioPanel className='col-span-6 p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>트렌드</h3>
        <MultiSeriesLineChart
          startMs={data.startMs}
          intervalMs={data.intervalMs}
          series={data.trendChart}
          yLabel='kWh'
          height={200}
        />
      </AioPanel>
    </div>
  )
}
