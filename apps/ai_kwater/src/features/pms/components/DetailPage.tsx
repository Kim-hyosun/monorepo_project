'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
import { usePmsMotorQuery, usePmsMotorsQuery } from '@/features/pms/queries/pmsQueries'
import type { PumpMotor } from '@/features/pms/types/pms'
import { cn } from '@/shared/utils/cn'

const chartLoading = <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>

const PmsLineChart = dynamic(() => import('@/features/pms/components/PmsLineChart'), {
  ssr: false,
  loading: () => chartLoading,
})
const LinechartM2 = dynamic(() => import('@/features/pms/components/charts/LinechartM2'), {
  ssr: false,
  loading: () => chartLoading,
})
const Linechart2 = dynamic(() => import('@/features/pms/components/charts/Linechart2'), {
  ssr: false,
  loading: () => chartLoading,
})
const Linechart3 = dynamic(() => import('@/features/pms/components/charts/Linechart3'), {
  ssr: false,
  loading: () => chartLoading,
})
const LinechartD21 = dynamic(() => import('@/features/pms/components/charts/LinechartD21'), {
  ssr: false,
  loading: () => chartLoading,
})
const LinechartD2 = dynamic(() => import('@/features/pms/components/charts/LinechartD2'), {
  ssr: false,
  loading: () => chartLoading,
})
const LinechartD3 = dynamic(() => import('@/features/pms/components/charts/LinechartD3'), {
  ssr: false,
  loading: () => chartLoading,
})
const LinechartD4 = dynamic(() => import('@/features/pms/components/charts/LinechartD4'), {
  ssr: false,
  loading: () => chartLoading,
})
const ScatterSSN = dynamic(() => import('@/features/pms/components/charts/ScatterSSN'), {
  ssr: false,
  loading: () => chartLoading,
})
const ScatterGac = dynamic(() => import('@/features/pms/components/charts/ScatterGac'), {
  ssr: false,
  loading: () => chartLoading,
})
const ScatterComp = dynamic(() => import('@/features/pms/components/charts/ScatterComp'), {
  ssr: false,
  loading: () => chartLoading,
})

interface Props {
  /** Detail1..18 인덱스. motors[index-1] 을 자동 선택 */
  index: number
  title: string
}

type Tab = 'amp' | 'vib' | 'scatter' | 'summary'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'amp', label: '전류' },
  { key: 'vib', label: '진동·온도' },
  { key: 'scatter', label: 'Scatter' },
  { key: 'summary', label: '요약' },
]

function buildSsnPoints(motor: PumpMotor) {
  return motor.motor_de_amp.map(([, v], i) => ({
    rpm: 1200 + Math.round(v * 18) + (i % 7) * 3,
    head: 35 + Math.round(v * 0.4 + Math.sin(i / 4) * 4),
  }))
}

function buildGacPoints(motor: PumpMotor) {
  return motor.temperature.map(([, t], i) => {
    const turbidity = +(0.04 + Math.sin(i / 5) * 0.02 + (t > 55 ? 0.05 : 0)).toFixed(3)
    const state = t > 60 ? 'alert' : t > 52 ? 'warning' : 'normal'
    return { hours: i * 1.2, turbidity, state: state as 'normal' | 'warning' | 'alert' }
  })
}

function buildCompGroups(motor: PumpMotor) {
  const len = Math.min(motor.motor_de_amp.length, motor.pump_de_amp.length)
  const normal: Array<{ motorDe: number; pumpDe: number }> = []
  const alert: Array<{ motorDe: number; pumpDe: number }> = []
  for (let i = 0; i < len; i++) {
    const motorDe = motor.motor_de_amp[i][1]
    const pumpDe = motor.pump_de_amp[i][1]
    const t = motor.temperature[i][1]
    if (t > 55) alert.push({ motorDe, pumpDe })
    else normal.push({ motorDe, pumpDe })
  }
  return [
    { name: '정상', color: '#5cafff', points: normal },
    { name: '경보', color: '#f87171', points: alert },
  ]
}

export function DetailPage({ index, title }: Props) {
  const { data: motors } = usePmsMotorsQuery()
  const motorId = motors?.[Math.min(index - 1, (motors?.length ?? 1) - 1)]?.id ?? null
  const { data: motor } = usePmsMotorQuery(motorId)

  const [tab, setTab] = useState<Tab>('amp')

  if (!motors || !motor) {
    return (
      <PmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </PmsPageWrapper>
    )
  }

  const vibVals = motor.vibration.map(([, v]) => v)
  const vibAvg = vibVals.length > 0 ? vibVals.reduce((a, b) => a + b, 0) / vibVals.length : 0
  const tempVals = motor.temperature.map(([, v]) => v)
  const tempMax = tempVals.length > 0 ? Math.max(...tempVals) : 60

  return (
    <PmsPageWrapper>
      <AioPageHeader title={title} description={motor.name} />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <KpiCard variant='dark' label='카테고리' value={motor.category} />
        <KpiCard variant='dark' label='상태' value={motor.status.toUpperCase()} />
        <KpiCard variant='dark' label='알람' value={motor.alarm ? 'ON' : 'OFF'} />
        <KpiCard variant='dark' label='진동' value={motor.vibration_val} unit='mm/s' />
        <KpiCard variant='dark' label='온도' value={motor.temperature_val} unit='℃' />
        <KpiCard variant='dark' label='모터 DE' value={motor.motor_de_amp_val} unit='A' />
        <KpiCard variant='dark' label='모터 NDE' value={motor.motor_nde_amp_val} unit='A' />
        <KpiCard variant='dark' label='펌프 DE' value={motor.pump_de_amp_val} unit='A' />
      </div>

      {/* 탭 */}
      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition',
              tab === t.key
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
            style={tab === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 전류 탭 */}
      {tab === 'amp' ? (
        <>
          <AioPanel className='p-3'>
            <PmsLineChart
              title='전류 4채널 (line)'
              series={[
                { name: '모터 DE', data: motor.motor_de_amp },
                { name: '모터 NDE', data: motor.motor_nde_amp },
                { name: '펌프 DE', data: motor.pump_de_amp },
                { name: '펌프 NDE', data: motor.pump_nde_amp },
              ]}
              yLabel='A'
              height={300}
            />
          </AioPanel>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            <AioPanel className='p-3'>
              <LinechartD4
                title='전류 4채널 (dashed)'
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
              <LinechartD3
                title='모터 3채널 dashed + 임계선'
                series={[
                  { name: '모터 DE', data: motor.motor_de_amp },
                  { name: '모터 NDE', data: motor.motor_nde_amp },
                  { name: '펌프 DE', data: motor.pump_de_amp },
                ]}
                yLabel='A'
                threshold={20}
              />
            </AioPanel>
          </div>
        </>
      ) : null}

      {/* 진동/온도 탭 */}
      {tab === 'vib' ? (
        <>
          <AioPanel className='p-3'>
            <LinechartD21
              primary={{ name: '진동', data: motor.vibration, unit: 'mm/s', color: '#FF4369' }}
              secondary={{ name: '온도', data: motor.temperature, unit: '℃', color: '#5cafff' }}
              primaryThreshold={3}
              title='진동 / 온도 (이중축 + 임계선)'
            />
          </AioPanel>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            <AioPanel className='p-3'>
              <Linechart2
                title='진동 (평균선)'
                data={motor.vibration}
                yLabel='mm/s'
                average={Number(vibAvg.toFixed(2))}
                color='#fbbf24'
              />
            </AioPanel>
            <AioPanel className='p-3'>
              <Linechart3 title='온도 (area)' data={motor.temperature} yLabel='℃' color='#f87171' />
            </AioPanel>
            <AioPanel className='p-3'>
              <LinechartD2
                title='진동 (상/하 임계선)'
                data={motor.vibration}
                upperThreshold={3}
                lowerThreshold={0.5}
                yLabel='mm/s'
                color='#FF4369'
              />
            </AioPanel>
            <AioPanel className='p-3'>
              <LinechartM2
                title='전류 (좌) / 진동·온도 (우)'
                primarySeries={[
                  { name: '모터 DE', data: motor.motor_de_amp },
                  { name: '펌프 DE', data: motor.pump_de_amp },
                ]}
                secondarySeries={[
                  { name: '진동', data: motor.vibration },
                  { name: '온도', data: motor.temperature },
                ]}
                primaryYLabel='A'
                secondaryYLabel='mm/s / ℃'
              />
            </AioPanel>
          </div>
        </>
      ) : null}

      {/* Scatter 탭 */}
      {tab === 'scatter' ? (
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <AioPanel className='p-3'>
            <ScatterSSN
              points={buildSsnPoints(motor)}
              rated={{ rpm: 1500, head: 60 }}
              current={{ rpm: 1380, head: 52 }}
              title='회전수 vs 양정'
            />
          </AioPanel>
          <AioPanel className='p-3'>
            <ScatterGac
              points={buildGacPoints(motor)}
              title={`운영시간 vs 출구탁도 (max temp ${tempMax.toFixed(1)}℃)`}
            />
          </AioPanel>
          <AioPanel className='p-3 md:col-span-2'>
            <ScatterComp groups={buildCompGroups(motor)} title='모터 vs 펌프 전류 비교' />
          </AioPanel>
        </div>
      ) : null}

      {/* 요약 탭 */}
      {tab === 'summary' ? (
        <AioPanel className='p-3'>
          <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>최근 측정 요약</h3>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-[var(--aio-panel-border)] text-left text-[var(--aio-subtitle)]'>
                <th className='py-2'>채널</th>
                <th className='py-2'>현재값</th>
                <th className='py-2'>최소</th>
                <th className='py-2'>최대</th>
                <th className='py-2'>평균</th>
              </tr>
            </thead>
            <tbody className='text-white'>
              {[
                {
                  name: '모터 DE 전류 (A)',
                  series: motor.motor_de_amp,
                  current: motor.motor_de_amp_val,
                },
                {
                  name: '모터 NDE 전류 (A)',
                  series: motor.motor_nde_amp,
                  current: motor.motor_nde_amp_val,
                },
                {
                  name: '펌프 DE 전류 (A)',
                  series: motor.pump_de_amp,
                  current: motor.pump_de_amp_val,
                },
                {
                  name: '펌프 NDE 전류 (A)',
                  series: motor.pump_nde_amp,
                  current: motor.pump_nde_amp_val,
                },
                { name: '진동 (mm/s)', series: motor.vibration, current: motor.vibration_val },
                { name: '온도 (℃)', series: motor.temperature, current: motor.temperature_val },
              ].map((row) => {
                const vals = row.series.map(([, v]) => v)
                const min = Math.min(...vals).toFixed(2)
                const max = Math.max(...vals).toFixed(2)
                const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
                return (
                  <tr key={row.name} className='border-b border-[var(--aio-panel-border)]/50'>
                    <td className='py-1.5'>{row.name}</td>
                    <td className='py-1.5'>{row.current}</td>
                    <td className='py-1.5'>{min}</td>
                    <td className='py-1.5'>{max}</td>
                    <td className='py-1.5'>{avg}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </AioPanel>
      ) : null}
    </PmsPageWrapper>
  )
}
