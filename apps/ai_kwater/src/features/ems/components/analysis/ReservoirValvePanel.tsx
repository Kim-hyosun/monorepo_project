'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { AnalysisReservoir, AnalysisValve } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  reservoirs: AnalysisReservoir[]
}

export function ReservoirValvePanel({ reservoirs }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>배수지 / 밸브</h3>
      <style>{`
        @keyframes wf-blink {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
      `}</style>
      <div className='space-y-3'>
        {reservoirs.map((r) => (
          <ReservoirRow key={r.name} reservoir={r} />
        ))}
      </div>
    </AioPanel>
  )
}

function ReservoirRow({ reservoir }: { reservoir: AnalysisReservoir }) {
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
      <div className='flex items-center gap-2'>
        <div
          className='flex h-8 min-w-12 items-center gap-1 rounded bg-[var(--aio-accent)]/20 px-2 text-sm font-semibold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {reservoir.name.replace('_2', '#2')}
          <span className='text-xs text-[var(--aio-subtitle)]'>
            {reservoir.minRequiredPressure.toFixed(2)}
          </span>
        </div>
        <ValueChip label='유입' value={reservoir.inflow} unit='m³/h' />
        <div className='flex flex-1 flex-col gap-1'>
          {reservoir.valves.map((v) => (
            <ValveRow key={v.id} valve={v} />
          ))}
        </div>
        <div className='flex w-20 flex-col gap-1 text-right text-xs'>
          <span className='rounded border border-[var(--aio-panel-border)] bg-black/20 px-2 py-1'>
            <span className='text-white'>{reservoir.waterLevels[0].toFixed(1)}</span>
            <span className='ml-0.5 text-[var(--aio-subtitle)]'>m</span>
          </span>
          <span className='rounded border border-[var(--aio-panel-border)] bg-black/20 px-2 py-1'>
            <span className='text-white'>{reservoir.waterLevels[1].toFixed(1)}</span>
            <span className='ml-0.5 text-[var(--aio-subtitle)]'>m</span>
          </span>
        </div>
        <ValueChip label='유출' value={reservoir.outflow} unit='m³/h' />
      </div>
    </div>
  )
}

function ValveRow({ valve }: { valve: AnalysisValve }) {
  return (
    <div className='flex items-center gap-1 text-xs'>
      <span
        className={cn(
          'inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]',
          valve.state === 'on'
            ? 'border-emerald-300 bg-emerald-400/30 text-emerald-200'
            : 'border-white/20 bg-black/40 text-white/40',
        )}
      >
        {valve.state === 'on' ? '●' : '○'}
      </span>
      <span className='w-12 rounded border border-[var(--aio-panel-border)] bg-black/20 px-1 text-right text-white'>
        {valve.opening.toFixed(1)}%
      </span>
      <div className='relative h-3 flex-1 overflow-hidden rounded-sm border border-[var(--aio-panel-border)] bg-black/30'>
        {valve.flowing ? (
          <div
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--aio-accent), transparent)',
              animation: 'wf-blink 1.4s ease-in-out infinite',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

function ValueChip({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className='flex w-20 flex-col text-center'>
      <span className='text-[10px] text-[var(--aio-subtitle)]'>{label}</span>
      <span className='rounded border border-[var(--aio-panel-border)] bg-black/20 px-1 py-0.5 text-xs text-white'>
        {value.toFixed(1)}
        <span className='ml-0.5 text-[var(--aio-subtitle)]'>{unit}</span>
      </span>
    </div>
  )
}
