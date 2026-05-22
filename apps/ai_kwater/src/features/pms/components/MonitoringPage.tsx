'use client'

import dynamic from 'next/dynamic'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
import { usePmsMotorsQuery } from '@/features/pms/queries/pmsQueries'

const PmsLineChart = dynamic(() => import('@/features/pms/components/PmsLineChart'), {
  ssr: false,
  loading: () => (
    <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>
  ),
})

export function MonitoringPage() {
  const { data: motors = [] } = usePmsMotorsQuery()

  const avgVibration =
    motors.length > 0
      ? +(motors.reduce((a, b) => a + b.vibration_val, 0) / motors.length).toFixed(2)
      : 0
  const avgTemp =
    motors.length > 0
      ? +(motors.reduce((a, b) => a + b.temperature_val, 0) / motors.length).toFixed(1)
      : 0
  const maxVibration = motors.length > 0 ? Math.max(...motors.map((m) => m.vibration_val)) : 0
  const maxTemp = motors.length > 0 ? Math.max(...motors.map((m) => m.temperature_val)) : 0

  const topMotors = [...motors]
    .sort((a, b) => b.vibration_val - a.vibration_val)
    .slice(0, 4)

  return (
    <PmsPageWrapper>
      <AioPageHeader title='통합 모니터링' description='전체 설비 진동 / 온도 추세' />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <KpiCard variant='dark' label='평균 진동' value={avgVibration} unit='mm/s' />
        <KpiCard variant='dark' label='최대 진동' value={maxVibration} unit='mm/s' highlight={maxVibration > 3} />
        <KpiCard variant='dark' label='평균 온도' value={avgTemp} unit='℃' />
        <KpiCard variant='dark' label='최대 온도' value={maxTemp} unit='℃' highlight={maxTemp > 55} />
      </div>

      <AioPanel className='p-3'>
        <PmsLineChart
          title='진동 상위 설비 4대'
          series={topMotors.map((m) => ({ name: m.name, data: m.vibration }))}
          yLabel='mm/s'
          height={320}
        />
      </AioPanel>

      <AioPanel className='p-3'>
        <PmsLineChart
          title='온도 상위 설비 4대'
          series={[...motors]
            .sort((a, b) => b.temperature_val - a.temperature_val)
            .slice(0, 4)
            .map((m) => ({ name: m.name, data: m.temperature }))}
          yLabel='℃'
          height={320}
        />
      </AioPanel>
    </PmsPageWrapper>
  )
}
