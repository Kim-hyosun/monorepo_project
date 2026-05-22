'use client'

import dynamic from 'next/dynamic'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import {
  useEmsLatestQuery,
  useEmsPeakSettingQuery,
} from '@/features/ems/queries/emsQueries'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

export type PeakVariant = 'peak' | 'peakControl'

const VARIANT_META: Record<PeakVariant, { title: string; description: string }> = {
  peak: { title: '피크', description: '피크 사용량 모니터링' },
  peakControl: { title: '피크 제어', description: '피크 제어 + DR 디스패치' },
}

interface Props {
  variant: PeakVariant
}

export function PeakPage({ variant }: Props) {
  const { data: latest } = useEmsLatestQuery()
  const { data: peakSetting } = useEmsPeakSettingQuery()
  const meta = VARIANT_META[variant]

  if (!latest) {
    return (
      <EmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  const { peak, dr, power_trend, ai_power_trend } = latest

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <div className='grid grid-cols-4 gap-3'>
        <KpiCard variant='dark' label='현재 피크' value={peak.z_power1} unit='kW' />
        <KpiCard variant='dark' label='AI 예측 피크' value={peak.ai_z_power1} unit='kW' highlight />
        <KpiCard variant='dark' label='AI 최대 피크' value={peak.ai_z_power_peak1} unit='kW' highlight />
        <KpiCard
          variant='dark'
          label='피크 한도'
          value={peakSetting?.peakLimitKw ?? '-'}
          unit='kW'
        />
        <KpiCard variant='dark' label='CBL' value={dr.z_cbl} unit='kW' />
        <KpiCard variant='dark' label='AI DR Power' value={dr.ai_z_dr_power} unit='kW' highlight />
        {variant === 'peakControl' ? (
          <>
            <KpiCard
              variant='dark'
              label='DR Dispatch'
              value={peakSetting?.drDispatchKw ?? '-'}
              unit='kW'
            />
            <KpiCard
              variant='dark'
              label='제어 상태'
              value={peakSetting?.enabled ? '활성' : '비활성'}
            />
          </>
        ) : null}
      </div>

      <AioPanel className='p-4'>
        <EmsLineChart
          title='전력 (실제 vs AI 추천)'
          series={[
            { name: '실제 Power', data: power_trend },
            { name: 'AI Power', data: ai_power_trend, color: '#34d399' },
          ]}
          yLabel='kW'
          height={300}
        />
      </AioPanel>

      {peakSetting ? (
        <AioPanel className='p-4'>
          <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>피크 시간대</h3>
          <div className='text-white'>
            {peakSetting.peakStartHour}시 ~ {peakSetting.peakEndHour}시 / 한도{' '}
            {peakSetting.peakLimitKw}kW / DR {peakSetting.drDispatchKw}kW
          </div>
        </AioPanel>
      ) : null}
    </EmsPageWrapper>
  )
}
