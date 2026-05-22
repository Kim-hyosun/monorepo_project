'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { AlertSidebar } from '@/features/pms/components/AlertSidebar'
import { MotorList } from '@/features/pms/components/MotorList'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
import {
  usePmsAlertsQuery,
  usePmsMotorQuery,
  usePmsMotorsQuery,
} from '@/features/pms/queries/pmsQueries'

const PmsLineChart = dynamic(() => import('@/features/pms/components/PmsLineChart'), {
  ssr: false,
  loading: () => (
    <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>
  ),
})

interface Props {
  /** Monitor1..18 의 인덱스. 동일 데이터를 기본 motor 로 선택하기 위한 prop */
  index: number
  title: string
}

export function MonitorPage({ index, title }: Props) {
  const { data: motors } = usePmsMotorsQuery()
  const { data: alerts = [] } = usePmsAlertsQuery()

  const initialId = motors?.[Math.min(index - 1, (motors?.length ?? 1) - 1)]?.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(null)
  useEffect(() => {
    if (!selectedId && initialId) setSelectedId(initialId)
  }, [initialId, selectedId])

  const { data: motor } = usePmsMotorQuery(selectedId)

  if (!motors) {
    return (
      <PmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </PmsPageWrapper>
    )
  }

  return (
    <PmsPageWrapper>
      <AioPageHeader title={title} description={`설비 ${motors.length}대 모니터링`} />

      <div className='grid grid-cols-12 gap-3'>
        <MotorList
          motors={motors}
          selectedId={selectedId}
          onSelect={setSelectedId}
          className='col-span-3 max-h-[640px]'
        />

        <div className='col-span-6 space-y-3'>
          {motor ? (
            <>
              <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                <KpiCard
                  variant='dark'
                  label='모터 DE 전류'
                  value={motor.motor_de_amp_val}
                  unit='A'
                  highlight={motor.status === 'error'}
                />
                <KpiCard variant='dark' label='모터 NDE 전류' value={motor.motor_nde_amp_val} unit='A' />
                <KpiCard variant='dark' label='펌프 DE 전류' value={motor.pump_de_amp_val} unit='A' />
                <KpiCard variant='dark' label='펌프 NDE 전류' value={motor.pump_nde_amp_val} unit='A' />
                <KpiCard
                  variant='dark'
                  label='진동'
                  value={motor.vibration_val}
                  unit='mm/s'
                  highlight={motor.vibration_val > 3}
                />
                <KpiCard
                  variant='dark'
                  label='온도'
                  value={motor.temperature_val}
                  unit='℃'
                  highlight={motor.temperature_val > 55}
                />
                <KpiCard variant='dark' label='상태' value={motor.status.toUpperCase()} />
                <KpiCard variant='dark' label='알람' value={motor.alarm ? 'ON' : 'OFF'} />
              </div>

              <AioPanel className='p-3'>
                <PmsLineChart
                  title='전류 (DE / NDE)'
                  series={[
                    { name: '모터 DE', data: motor.motor_de_amp },
                    { name: '모터 NDE', data: motor.motor_nde_amp },
                    { name: '펌프 DE', data: motor.pump_de_amp },
                    { name: '펌프 NDE', data: motor.pump_nde_amp },
                  ]}
                  yLabel='A'
                />
              </AioPanel>

              <AioPanel className='p-3'>
                <PmsLineChart
                  title='진동 / 온도'
                  series={[
                    { name: '진동', data: motor.vibration, color: '#fbbf24' },
                    { name: '온도', data: motor.temperature, color: '#f87171' },
                  ]}
                  yLabel='value'
                />
              </AioPanel>
            </>
          ) : (
            <AioPanel className='p-6 text-center text-[var(--aio-subtitle)]'>
              좌측에서 설비를 선택하세요
            </AioPanel>
          )}
        </div>

        <AlertSidebar alerts={alerts} className='col-span-3' />
      </div>
    </PmsPageWrapper>
  )
}
