'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SongsuPumpState } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  pyeongtaek: SongsuPumpState
  songsan: SongsuPumpState
}

export function CurrentPumpSection({ pyeongtaek, songsan }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>운영중인 펌프</h3>
      <div className='grid grid-cols-2 gap-3'>
        <Block label='평택' pump={pyeongtaek} pumpCount={4} />
        <Block label='송산' pump={songsan} pumpCount={2} showFreq />
      </div>
    </AioPanel>
  )
}

function Block({
  label,
  pump,
  pumpCount,
  showFreq,
}: {
  label: string
  pump: SongsuPumpState
  pumpCount: number
  showFreq?: boolean
}) {
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
      <div className='mb-2 flex items-center justify-between'>
        <span
          className='rounded bg-[var(--aio-accent)]/20 px-2 py-0.5 text-sm font-semibold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {label}
        </span>
      </div>
      <ul className='mb-3 space-y-1 text-xs'>
        <Row label='전력' value={pump.power.toFixed(1)} unit='kW' />
        <Row label='관압' value={pump.pressure.toFixed(2)} unit='kg/cm²' />
        <Row label='유량' value={pump.flow.toLocaleString()} unit='m³' />
      </ul>
      <div className={cn('grid gap-1', pumpCount === 4 ? 'grid-cols-4' : 'grid-cols-2')}>
        {Array.from({ length: pumpCount }).map((_, i) => {
          const on = pump.pumps[i] ?? false
          return (
            <div
              key={i}
              className={cn(
                'rounded border py-2 text-center text-xs font-semibold',
                on
                  ? 'border-[var(--aio-accent)] bg-[var(--aio-accent)]/20 text-white'
                  : 'border-white/10 bg-black/30 text-white/40',
              )}
              style={on ? { textShadow: 'var(--aio-text-glow)' } : undefined}
            >
              #{i + 1}
            </div>
          )
        })}
      </div>
      {showFreq ? (
        <div className='mt-2 grid grid-cols-2 gap-1'>
          {pump.freq.map((f, i) => (
            <div
              key={i}
              className='rounded border border-[var(--aio-panel-border)] bg-black/40 py-1 text-center text-xs text-white'
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

function Row({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <li className='flex items-baseline justify-between'>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span>
        <span className='text-sm font-semibold text-white'>{value}</span>
        <span className='ml-1 text-[var(--aio-subtitle)]'>{unit}</span>
      </span>
    </li>
  )
}
