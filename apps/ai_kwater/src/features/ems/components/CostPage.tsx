'use client'

import dynamic from 'next/dynamic'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import { useEmsCostsQuery, useEmsGoalQuery } from '@/features/ems/queries/emsQueries'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

export type CostVariant = 'cost' | 'reduction' | 'report'

const VARIANT_META: Record<CostVariant, { title: string; description: string }> = {
  cost: { title: '비용', description: '월별 전력 비용' },
  reduction: { title: '절감', description: '월별 절감 실적' },
  report: { title: '리포트', description: '월별 사용량 / 비용 리포트' },
}

interface Props {
  variant: CostVariant
}

export function CostPage({ variant }: Props) {
  const { data: items = [] } = useEmsCostsQuery()
  const { data: goal } = useEmsGoalQuery()
  const meta = VARIANT_META[variant]

  const totalFee = items.reduce((s, c) => s + c.fee, 0)
  const totalUsage = items.reduce((s, c) => s + c.usage, 0)
  const totalReduction = items.reduce((s, c) => s + c.reduction, 0)
  const reductionPct = totalUsage > 0 ? (totalReduction / totalUsage) * 100 : 0

  const xCategories = items.map((c) => c.month)
  const feeSeries = items.map<[number, number]>((c, i) => [i, c.fee])
  const usageSeries = items.map<[number, number]>((c, i) => [i, c.usage])
  const reductionSeries = items.map<[number, number]>((c, i) => [i, c.reduction])

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <div className='grid grid-cols-4 gap-3'>
        <KpiCard variant='dark' label='연 총 비용' value={totalFee.toLocaleString()} unit='원' />
        <KpiCard variant='dark' label='연 총 사용' value={totalUsage.toLocaleString()} unit='kWh' />
        <KpiCard
          variant='dark'
          label='연 절감'
          value={totalReduction.toLocaleString()}
          unit='kWh'
          highlight
        />
        <KpiCard
          variant='dark'
          label='절감률'
          value={reductionPct.toFixed(1)}
          unit='%'
          highlight={goal ? reductionPct >= goal.targetReductionPct : false}
        />
        {goal ? (
          <>
            <KpiCard
              variant='dark'
              label='목표 절감률'
              value={goal.targetReductionPct}
              unit='%'
            />
            <KpiCard
              variant='dark'
              label='목표 비용'
              value={goal.targetCostKrw.toLocaleString()}
              unit='원'
            />
            <KpiCard variant='dark' label='목표 피크' value={goal.targetPeakKw} unit='kW' />
            <KpiCard variant='dark' label='회계년도' value={goal.fiscalYear} />
          </>
        ) : null}
      </div>

      {variant !== 'reduction' ? (
        <AioPanel className='p-4'>
          <EmsLineChart
            title='월별 비용'
            xAxisType='category'
            categories={xCategories}
            series={[{ name: '비용 (원)', data: feeSeries, type: 'bar', color: '#fbbf24' }]}
            yLabel='원'
            height={280}
          />
        </AioPanel>
      ) : null}

      {variant !== 'cost' ? (
        <AioPanel className='p-4'>
          <EmsLineChart
            title='월별 사용량 / 절감량'
            xAxisType='category'
            categories={xCategories}
            series={[
              { name: '사용 (kWh)', data: usageSeries },
              { name: '절감 (kWh)', data: reductionSeries, color: '#34d399' },
            ]}
            yLabel='kWh'
            height={280}
          />
        </AioPanel>
      ) : null}

      {variant === 'report' ? (
        <AioPanel className='p-4'>
          <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>월별 명세</h3>
          <table className='w-full text-sm'>
            <thead className='text-[var(--aio-subtitle)]'>
              <tr>
                <th className='py-2 text-left'>월</th>
                <th className='py-2 text-right'>사용 (kWh)</th>
                <th className='py-2 text-right'>피크 (kW)</th>
                <th className='py-2 text-right'>절감 (kWh)</th>
                <th className='py-2 text-right'>비용 (원)</th>
              </tr>
            </thead>
            <tbody className='text-white'>
              {items.map((c) => (
                <tr key={c.month} className='border-t border-[var(--aio-panel-border)]'>
                  <td className='py-2'>{c.month}</td>
                  <td className='py-2 text-right'>{c.usage.toLocaleString()}</td>
                  <td className='py-2 text-right'>{c.peak.toLocaleString()}</td>
                  <td className='py-2 text-right text-emerald-300'>{c.reduction.toLocaleString()}</td>
                  <td className='py-2 text-right'>{c.fee.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AioPanel>
      ) : null}
    </EmsPageWrapper>
  )
}
