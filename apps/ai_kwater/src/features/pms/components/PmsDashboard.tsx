'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { AlertSidebar } from '@/features/pms/components/AlertSidebar'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'

const BarChartMain = dynamic(() => import('@/features/pms/components/charts/BarChartMain'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})
const PieChartMain = dynamic(() => import('@/features/pms/components/charts/PieChartMain'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})
const BarChartMain2 = dynamic(() => import('@/features/pms/components/charts/BarChartMain2'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})
const PieChartCenter = dynamic(() => import('@/features/pms/components/charts/PieChartCenter'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>로딩…</div>,
})
import { MotorSparkline } from '@/features/pms/components/MotorSparkline'
import {
  usePmsAlertsQuery,
  usePmsMotorsQuery,
  usePmsProcessStatusQuery,
} from '@/features/pms/queries/pmsQueries'
import { cn } from '@/shared/utils/cn'

export function PmsDashboard() {
  const { data: motors = [] } = usePmsMotorsQuery()
  const { data: alerts = [] } = usePmsAlertsQuery()
  const { data: process = [] } = usePmsProcessStatusQuery()

  const totalNormal = motors.filter((m) => m.status === 'normal').length
  const totalWarning = motors.filter((m) => m.status === 'warning').length
  const totalError = motors.filter((m) => m.status === 'error').length
  const healthRate = motors.length > 0 ? (totalNormal / motors.length) * 100 : 0

  return (
    <PmsPageWrapper>
      <AioPageHeader title='PMS Dashboard' description='펌프 모터 상태 통합 모니터링' />

      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-9 space-y-3'>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
            <AioPanel className='p-2'>
              <PieChartCenter value={healthRate} label='정상률' height={140} color='#34d399' />
            </AioPanel>
            <AioPanel className='p-4'>
              <div className='text-xs text-[var(--aio-subtitle)]'>전체 설비</div>
              <div className='mt-1 text-2xl font-semibold text-white'>{motors.length}</div>
            </AioPanel>
            <AioPanel className='p-4'>
              <div className='text-xs text-[var(--aio-subtitle)]'>정상</div>
              <div className='mt-1 text-2xl font-semibold text-emerald-300'>{totalNormal}</div>
            </AioPanel>
            <AioPanel className='p-4'>
              <div className='text-xs text-[var(--aio-subtitle)]'>주의</div>
              <div className='mt-1 text-2xl font-semibold text-amber-300'>{totalWarning}</div>
            </AioPanel>
            <AioPanel className='p-4'>
              <div className='text-xs text-[var(--aio-subtitle)]'>경보</div>
              <div className='mt-1 text-2xl font-semibold text-rose-400'>{totalError}</div>
            </AioPanel>
          </div>

          <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
            <AioPanel className='p-4'>
              <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>
                설비 상태 분포
              </h3>
              <PieChartMain
                slices={[
                  { name: '정상', value: totalNormal, color: '#34d399' },
                  { name: '주의', value: totalWarning, color: '#fbbf24' },
                  { name: '경보', value: totalError, color: '#f87171' },
                ]}
                centerText={`<b>${motors.length}</b><br/>전체`}
                height={240}
              />
            </AioPanel>
            <AioPanel className='p-4'>
              <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>
                공정별 정상/경보 (가로 bar)
              </h3>
              <BarChartMain2
                bars={process.map((p) => ({
                  name: p.title,
                  value: p.normal,
                  secondary: p.err,
                }))}
                height={240}
              />
            </AioPanel>
          </div>

          <AioPanel className='p-4'>
            <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>공정별 상태</h3>
            {process.length > 0 ? <BarChartMain process={process} height={220} /> : null}
            <div className='mt-3 grid grid-cols-4 gap-2 md:grid-cols-8'>
              {process.map((p) => (
                <div
                  key={p.index}
                  className='rounded-md border border-[var(--aio-panel-border)] bg-black/20 p-2 text-center'
                >
                  <div className='text-[10px] text-[var(--aio-subtitle)]'>{p.title}</div>
                  <div className='mt-0.5 flex items-baseline justify-center gap-1'>
                    <span className='text-sm font-semibold text-emerald-300'>{p.normal}</span>
                    <span className='text-[10px] text-[var(--aio-subtitle)]'>/</span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        p.err > 0 ? 'text-rose-400' : 'text-white/60',
                      )}
                    >
                      {p.err}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AioPanel>

          <AioPanel className='p-4'>
            <style>{`
              @keyframes pms-motor-spin-3d-sm {
                0% { transform: perspective(180px) rotateX(60deg) rotateZ(0deg); }
                100% { transform: perspective(180px) rotateX(60deg) rotateZ(360deg); }
              }
            `}</style>
            <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>설비 목록</h3>
            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              {motors.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'relative flex items-center gap-2 overflow-hidden rounded border bg-black/30 p-2 text-sm',
                    m.status === 'error'
                      ? 'border-rose-500/50 text-rose-300'
                      : m.status === 'warning'
                        ? 'border-amber-300/50 text-amber-200'
                        : 'border-[var(--aio-panel-border)] text-white',
                  )}
                >
                  <div className='relative h-10 w-10 shrink-0' style={{ perspective: '180px' }}>
                    <div
                      className='absolute inset-0'
                      style={{
                        animation: 'pms-motor-spin-3d-sm 8s linear infinite',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Image
                        src={m.status === 'error' ? '/pms/motor_alert.png' : '/pms/motor.png'}
                        alt=''
                        fill
                        sizes='40px'
                        className='object-contain opacity-90'
                      />
                    </div>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-xs font-medium'>{m.name}</div>
                    <div className='mt-0.5 text-[10px] text-[var(--aio-subtitle)]'>
                      DE {m.motor_de_amp_val}A · {m.temperature_val}℃
                    </div>
                    <div className='mt-1'>
                      <MotorSparkline
                        data={m.vibration}
                        color={
                          m.status === 'error'
                            ? '#f87171'
                            : m.status === 'warning'
                              ? '#fbbf24'
                              : '#5cafff'
                        }
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AioPanel>
        </div>

        <AlertSidebar alerts={alerts} className='col-span-3' />
      </div>
    </PmsPageWrapper>
  )
}
