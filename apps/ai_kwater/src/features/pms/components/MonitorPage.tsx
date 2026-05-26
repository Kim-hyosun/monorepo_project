'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { AlertSidebar } from '@/features/pms/components/AlertSidebar'
import { MotorList } from '@/features/pms/components/MotorList'
import {
  MotorThermometer,
  MotorVibrationOverlay,
} from '@/features/pms/components/MotorVisualization'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
import {
  usePmsAlertsQuery,
  usePmsMotorQuery,
  usePmsMotorsQuery,
} from '@/features/pms/queries/pmsQueries'

const PmsLineChart = dynamic(() => import('@/features/pms/components/PmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

const LinechartD = dynamic(() => import('@/features/pms/components/charts/LinechartD'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

const ScatterPTK = dynamic(() => import('@/features/pms/components/charts/ScatterPTK'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

const LinechartD22 = dynamic(() => import('@/features/pms/components/charts/LinechartD22'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

function buildScatterPoints(motor: {
  motor_de_amp: Array<[number, number]>
  motor_nde_amp: Array<[number, number]>
  vibration: Array<[number, number]>
  temperature: Array<[number, number]>
  status: string
}) {
  /** 시계열 → (DE 전류, NDE 전류) 산점 + 진동/온도 기반 카테고리 분류 */
  const points: Array<{
    flow: number
    pressure: number
    category: 'Normal' | 'Warning' | 'Critical' | 'Fault'
  }> = []
  const n = Math.min(
    motor.motor_de_amp.length,
    motor.motor_nde_amp.length,
    motor.vibration.length,
    motor.temperature.length,
  )
  for (let i = 0; i < n; i += 2) {
    const flow = motor.motor_de_amp[i][1]
    const pressure = motor.motor_nde_amp[i][1]
    const vib = motor.vibration[i][1]
    const temp = motor.temperature[i][1]
    const cat =
      temp > 65 || vib > 4
        ? 'Fault'
        : temp > 55 || vib > 3
          ? 'Critical'
          : vib > 2
            ? 'Warning'
            : 'Normal'
    points.push({ flow, pressure, category: cat })
  }
  return points
}

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
              <AioPanel className='relative overflow-hidden p-4'>
                <style>{`
                  @keyframes pms-motor-spin-3d {
                    0% { transform: perspective(420px) rotateX(60deg) rotateZ(0deg); }
                    100% { transform: perspective(420px) rotateX(60deg) rotateZ(360deg); }
                  }
                `}</style>
                <div className='flex items-center gap-4'>
                  <div
                    className='relative h-32 w-40 shrink-0 overflow-hidden'
                    style={{ perspective: '420px' }}
                  >
                    <Image
                      src='/pms/motor_back.png'
                      alt=''
                      fill
                      sizes='160px'
                      className='object-contain opacity-70'
                    />
                    <div
                      className='absolute inset-0'
                      style={{
                        animation: 'pms-motor-spin-3d 6s linear infinite',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Image
                        src={motor.status === 'error' ? '/pms/motor_alert.png' : '/pms/motor.png'}
                        alt='모터'
                        fill
                        sizes='160px'
                        className='object-contain drop-shadow-[0_0_18px_rgba(92,175,255,0.6)]'
                      />
                    </div>
                    {/* vibration wave overlay (진폭/속도 motor.vibration_val 기반) */}
                    <MotorVibrationOverlay value={motor.vibration_val} />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='text-base font-semibold text-white'>{motor.name}</div>
                    <div className='text-xs text-[var(--aio-subtitle)]'>{motor.category}</div>
                    <div className='flex items-center gap-2 text-xs'>
                      <span
                        className={
                          motor.status === 'error'
                            ? 'rounded bg-red-500/20 px-1.5 py-0.5 text-red-300'
                            : 'rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-300'
                        }
                      >
                        {motor.status.toUpperCase()}
                      </span>
                      {motor.alarm ? (
                        <span className='rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300'>
                          ALARM
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {/* Thermometer indicator */}
                  <MotorThermometer value={motor.temperature_val} />
                </div>
              </AioPanel>

              <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                <KpiCard
                  variant='dark'
                  label='모터 DE 전류'
                  value={motor.motor_de_amp_val}
                  unit='A'
                  highlight={motor.status === 'error'}
                />
                <KpiCard
                  variant='dark'
                  label='모터 NDE 전류'
                  value={motor.motor_nde_amp_val}
                  unit='A'
                />
                <KpiCard
                  variant='dark'
                  label='펌프 DE 전류'
                  value={motor.pump_de_amp_val}
                  unit='A'
                />
                <KpiCard
                  variant='dark'
                  label='펌프 NDE 전류'
                  value={motor.pump_nde_amp_val}
                  unit='A'
                />
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

              <AioPanel className='p-3'>
                <LinechartD
                  title='진동 임계선 분석'
                  data={motor.vibration}
                  threshold={3}
                  yLabel='mm/s'
                  height={220}
                />
              </AioPanel>

              <AioPanel className='p-3'>
                <LinechartD22
                  primary={{ name: '진동', data: motor.vibration, unit: 'mm/s', color: '#34d399' }}
                  secondary={{ name: '온도', data: motor.temperature, unit: '℃', color: '#FF4369' }}
                  title='진동(area) / 온도(dashed)'
                  height={240}
                />
              </AioPanel>

              <AioPanel className='p-3'>
                <ScatterPTK
                  points={buildScatterPoints(motor)}
                  current={{
                    flow: motor.motor_de_amp_val,
                    pressure: motor.motor_nde_amp_val,
                    color: motor.status === 'error' ? '#ef4444' : '#5cafff',
                  }}
                  height={300}
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
