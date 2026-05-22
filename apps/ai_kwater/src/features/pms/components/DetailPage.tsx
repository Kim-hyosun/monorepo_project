'use client'

import dynamic from 'next/dynamic'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
import { usePmsMotorQuery, usePmsMotorsQuery } from '@/features/pms/queries/pmsQueries'

const PmsLineChart = dynamic(() => import('@/features/pms/components/PmsLineChart'), {
  ssr: false,
  loading: () => (
    <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>
  ),
})

interface Props {
  /** Detail1..18 인덱스. motors[index-1] 을 자동 선택 */
  index: number
  title: string
}

export function DetailPage({ index, title }: Props) {
  const { data: motors } = usePmsMotorsQuery()
  const motorId = motors?.[Math.min(index - 1, (motors?.length ?? 1) - 1)]?.id ?? null
  const { data: motor } = usePmsMotorQuery(motorId)

  if (!motors || !motor) {
    return (
      <PmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </PmsPageWrapper>
    )
  }

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

      <AioPanel className='p-3'>
        <PmsLineChart
          title='전류 4채널'
          series={[
            { name: '모터 DE', data: motor.motor_de_amp },
            { name: '모터 NDE', data: motor.motor_nde_amp },
            { name: '펌프 DE', data: motor.pump_de_amp },
            { name: '펌프 NDE', data: motor.pump_nde_amp },
          ]}
          yLabel='A'
          height={320}
        />
      </AioPanel>

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
              { name: '모터 DE 전류 (A)', series: motor.motor_de_amp, current: motor.motor_de_amp_val },
              { name: '모터 NDE 전류 (A)', series: motor.motor_nde_amp, current: motor.motor_nde_amp_val },
              { name: '펌프 DE 전류 (A)', series: motor.pump_de_amp, current: motor.pump_de_amp_val },
              { name: '펌프 NDE 전류 (A)', series: motor.pump_nde_amp, current: motor.pump_nde_amp_val },
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
    </PmsPageWrapper>
  )
}
