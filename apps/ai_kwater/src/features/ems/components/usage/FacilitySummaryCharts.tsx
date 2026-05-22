'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import type { FacUsageData } from '@/features/ems/types/ems'

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
  data: FacUsageData
}

export function FacilitySummaryCharts({ data }: Props) {
  return (
    <>
      <AioPanel className='p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>설비 트렌드</h3>
        <MultiSeriesLineChart
          startMs={data.startMs}
          intervalMs={data.intervalMs}
          series={data.facilityTrend}
          yLabel='kWh'
          height={220}
          type='area'
        />
      </AioPanel>

      <div className='grid grid-cols-12 gap-3'>
        <AioPanel className='col-span-3 p-4'>
          <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>설비별 합계</h3>
          <CategoryPieChart items={data.sumChart} height={200} />
        </AioPanel>
        <AioPanel className='col-span-3 p-4'>
          <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>분포</h3>
          <CategoryBarChart items={data.distributionChart} height={200} yLabel='kW' />
        </AioPanel>
        <AioPanel className='col-span-6 p-4'>
          <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>순시 전력</h3>
          <MultiSeriesLineChart
            startMs={data.startMs}
            intervalMs={3_600_000}
            series={data.streamChart}
            yLabel='kW'
            height={200}
          />
        </AioPanel>
      </div>
    </>
  )
}
