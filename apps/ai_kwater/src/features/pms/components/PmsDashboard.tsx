'use client'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { AlertSidebar } from '@/features/pms/components/AlertSidebar'
import { PmsPageWrapper } from '@/features/pms/components/PmsPageWrapper'
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

  return (
    <PmsPageWrapper>
      <AioPageHeader title='PMS Dashboard' description='펌프 모터 상태 통합 모니터링' />

      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-9 space-y-3'>
          <div className='grid grid-cols-4 gap-3'>
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

          <AioPanel className='p-4'>
            <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>공정별 상태</h3>
            <div className='grid grid-cols-4 gap-3 md:grid-cols-8'>
              {process.map((p) => (
                <div
                  key={p.index}
                  className='rounded-md border border-[var(--aio-panel-border)] bg-black/20 p-3 text-center'
                >
                  <div className='text-xs text-[var(--aio-subtitle)]'>{p.title}</div>
                  <div className='mt-1 flex items-baseline justify-center gap-1'>
                    <span className='text-lg font-semibold text-emerald-300'>{p.normal}</span>
                    <span className='text-xs text-[var(--aio-subtitle)]'>/</span>
                    <span
                      className={cn(
                        'text-lg font-semibold',
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
            <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>설비 목록</h3>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
              {motors.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'rounded border bg-black/20 p-2 text-sm',
                    m.status === 'error'
                      ? 'border-rose-500/50 text-rose-300'
                      : m.status === 'warning'
                        ? 'border-amber-300/50 text-amber-200'
                        : 'border-[var(--aio-panel-border)] text-white',
                  )}
                >
                  <div className='truncate text-xs'>{m.name}</div>
                  <div className='mt-1 text-xs text-[var(--aio-subtitle)]'>
                    DE {m.motor_de_amp_val}A · {m.temperature_val}℃
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
