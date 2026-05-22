'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ProcessLoad } from '@/features/ems/types/ems'

interface Props {
  processes: ProcessLoad[]
}

export function LoadDistributionGrid({ processes }: Props) {
  return (
    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
      {processes.map((p) => (
        <ProcessCard key={p.title} process={p} />
      ))}
    </div>
  )
}

function ProcessCard({ process: p }: { process: ProcessLoad }) {
  return (
    <AioPanel className='p-4'>
      <h3
        className='mb-3 text-sm font-semibold text-white'
        style={{ textShadow: 'var(--aio-text-glow)' }}
      >
        {p.title}
      </h3>
      <div className='mb-3 grid grid-cols-2 gap-2 rounded border border-[var(--aio-panel-border)] bg-black/30 p-3 text-xs'>
        <Stat label='전체 사용량' value={p.allUsed.toLocaleString()} unit='kWh' />
        <Stat label='전체 비용' value={p.allCost.toLocaleString()} unit='원' />
      </div>
      <ul className='space-y-3'>
        {p.loads.map((l) => (
          <li key={l.name}>
            <div className='mb-1 flex items-baseline justify-between text-xs'>
              <span className='font-semibold text-[var(--aio-subtitle)]'>{l.name}</span>
              <span className='text-white/70'>
                {l.kwh.toLocaleString()} kWh · {l.cost.toLocaleString()} 원
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Bar label='사용량' pct={l.percentUsed} color='var(--aio-accent)' />
              <Bar label='비용' pct={l.percentCost} color='#34d399' />
            </div>
          </li>
        ))}
      </ul>
    </AioPanel>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className='text-[var(--aio-subtitle)]'>{label}</div>
      <div className='mt-0.5'>
        <span className='text-sm font-semibold text-white'>{value}</span>
        <span className='ml-1 text-[var(--aio-subtitle)]'>{unit}</span>
      </div>
    </div>
  )
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div>
      <div className='mb-0.5 flex items-baseline justify-between text-[10px] text-[var(--aio-subtitle)]'>
        <span>{label}</span>
        <span className='text-white'>{clamped.toFixed(1)}%</span>
      </div>
      <div className='h-2 w-full overflow-hidden rounded-full bg-white/10'>
        <div className='h-full transition-all' style={{ width: `${clamped}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
