'use client'

import { useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { ModeToggleBar, type OperationMode } from '@/shared/components/ModeToggleBar'
import { DrParticipationPanel } from '@/features/ems/components/dashboard/DrParticipationPanel'
import { EnergyFactorsCard } from '@/features/ems/components/dashboard/EnergyFactorsCard'
import { PlantMapDiagram } from '@/features/ems/components/dashboard/PlantMapDiagram'
import { PumpStatusCarousel } from '@/features/ems/components/dashboard/PumpStatusCarousel'
import { ReservoirPanel } from '@/features/ems/components/dashboard/ReservoirPanel'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import {
  useEmsDrParticipationQuery,
  useEmsFactorQuery,
  useEmsLatestQuery,
  useEmsReservoirsQuery,
  useEmsZonesQuery,
  useUpdateEmsOperationMode,
} from '@/features/ems/queries/emsQueries'
import { cn } from '@/shared/utils/cn'

type EmsTab = 'kpi' | 'plant' | 'reservoir'
const EMS_TABS: Array<{ key: EmsTab; label: string }> = [
  { key: 'kpi', label: 'KPI / 펌프' },
  { key: 'plant', label: '정수장 배치도' },
  { key: 'reservoir', label: '배수지 / DR' },
]

export function EmsDashboard() {
  const { data: latest } = useEmsLatestQuery()
  const { data: factor } = useEmsFactorQuery()
  const { data: zones = [] } = useEmsZonesQuery()
  const { data: reservoirs = [] } = useEmsReservoirsQuery()
  const { data: dr } = useEmsDrParticipationQuery()
  const updateMode = useUpdateEmsOperationMode()
  const [tab, setTab] = useState<EmsTab>('kpi')

  if (!latest || !factor || !dr) {
    return (
      <EmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  const { pump } = latest

  return (
    <EmsPageWrapper>
      <AioPageHeader
        title='EMS Dashboard'
        description='에너지 관리 통합 모니터링'
        actions={
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-[var(--aio-subtitle)]'>평택 H1</span>
              <ModeToggleBar
                variant='dark'
                value={pump.h1_operation_mode as OperationMode | null}
                onChange={(mode) => updateMode.mutate({ channel: 'h1', mode })}
                disabled={updateMode.isPending}
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-[var(--aio-subtitle)]'>안성 H2</span>
              <ModeToggleBar
                variant='dark'
                value={pump.h2_operation_mode as OperationMode | null}
                onChange={(mode) => updateMode.mutate({ channel: 'h2', mode })}
                disabled={updateMode.isPending}
              />
            </div>
          </div>
        }
      />

      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {EMS_TABS.map((t) => (
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

      {tab === 'kpi' ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 lg:col-span-8'>
            <EnergyFactorsCard factor={factor} />
          </div>
          <div className='col-span-12 lg:col-span-4'>
            <PumpStatusCarousel latest={latest} />
          </div>
        </div>
      ) : null}

      {tab === 'plant' ? (
        zones.length ? (
          <PlantMapDiagram zones={zones} />
        ) : (
          <AioPanel className='flex h-[440px] items-center justify-center p-6 text-[var(--aio-subtitle)]'>
            zone 데이터 없음
          </AioPanel>
        )
      ) : null}

      {tab === 'reservoir' ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 lg:col-span-6'>
            {reservoirs.length ? (
              <ReservoirPanel reservoirs={reservoirs} />
            ) : (
              <AioPanel className='p-6 text-center text-[var(--aio-subtitle)]'>
                배수지 데이터 없음
              </AioPanel>
            )}
          </div>
          <div className='col-span-12 lg:col-span-6'>
            <DrParticipationPanel dr={dr} />
          </div>
        </div>
      ) : null}
    </EmsPageWrapper>
  )
}
