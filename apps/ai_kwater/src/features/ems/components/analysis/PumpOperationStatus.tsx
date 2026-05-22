'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { AnalysisStation } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  pyeongtaek: AnalysisStation
  songsan: AnalysisStation
}

export function PumpOperationStatus({ pyeongtaek, songsan }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>
        운영현황 / 주요인자
      </h3>
      <Station label='평택' station={pyeongtaek} pumpCount={4} />
      <div className='my-3 h-px bg-[var(--aio-panel-border)]' />
      <Station label='송산' station={songsan} pumpCount={2} showFreq />
    </AioPanel>
  )
}

function Station({
  label,
  station,
  pumpCount,
  showFreq,
}: {
  label: string
  station: AnalysisStation
  pumpCount: number
  showFreq?: boolean
}) {
  return (
    <div>
      <div className='mb-2 flex items-center gap-3'>
        <span
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--aio-accent)]/40 bg-black/40 text-sm font-semibold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {label}
        </span>
        <div className='flex flex-1 flex-col gap-1'>
          <Metric label='관압' value={station.pressure.toFixed(1)} unit='kg/cm²' />
          <Metric label='유량' value={station.flow.toFixed(1)} unit='m³' />
        </div>
      </div>
      <div className={cn('grid gap-2', pumpCount === 4 ? 'grid-cols-4' : 'grid-cols-2')}>
        {Array.from({ length: pumpCount }).map((_, i) => {
          const on = station.activePumps[i] ?? false
          return (
            <div
              key={i}
              className={cn(
                'flex h-12 items-center justify-center rounded border text-sm font-semibold',
                on
                  ? 'border-[var(--aio-accent)] bg-[var(--aio-accent)]/20 text-white'
                  : 'border-white/10 bg-black/30 text-white/40',
              )}
              style={on ? { textShadow: 'var(--aio-text-glow)' } : undefined}
            >
              #{i + 1}
              {on ? <span className='ml-1 text-xs text-emerald-300'>ON</span> : null}
            </div>
          )
        })}
      </div>
      {showFreq ? (
        <div className='mt-2 grid grid-cols-2 gap-2'>
          {station.freq.map((f, i) => (
            <div
              key={i}
              className='rounded border border-[var(--aio-panel-border)] bg-black/30 px-2 py-1 text-center text-xs text-white'
            >
              <span className='font-semibold'>{f.toFixed(2)}</span>
              <span className='ml-1 text-[var(--aio-subtitle)]'>Hz</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className='flex items-baseline justify-between text-xs'>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span>
        <span className='text-base font-semibold text-white'>{value}</span>
        <span className='ml-1 text-[var(--aio-subtitle)]'>{unit}</span>
      </span>
    </div>
  )
}
