'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import type { Reservoir, ReservoirName } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  reservoirs: Reservoir[]
}

export function ReservoirPanel({ reservoirs }: Props) {
  const [active, setActive] = useState<ReservoirName>(reservoirs[0]?.name ?? '봉담2')
  const current = reservoirs.find((r) => r.name === active) ?? reservoirs[0]

  return (
    <AioPanel className='p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <a
          href='/songsu'
          className='text-sm font-semibold text-white hover:underline'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          주요배수지 현황
        </a>
      </div>
      <div className='mb-3 flex gap-1'>
        {reservoirs.map((r) => (
          <button
            key={r.name}
            type='button'
            onClick={() => setActive(r.name)}
            className={cn(
              'flex-1 rounded px-2 py-1 text-xs font-medium transition',
              r.name === active
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10',
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      {current ? (
        <>
          <div className='mb-2 grid grid-cols-2 gap-2'>
            <Kpi label='수위' value={current.levelPct} unit='%' bar={current.levelPct} />
            <Kpi label='유량' value={current.flowRate} unit='m³/h' />
          </div>
          <EmsLineChart
            series={[{ name: '사용', data: current.usageTrend }]}
            yLabel='m³/h'
            height={140}
          />
        </>
      ) : null}
    </AioPanel>
  )
}

function Kpi({ label, value, unit, bar }: { label: string; value: number; unit: string; bar?: number }) {
  return (
    <div className='rounded border border-[var(--aio-panel-border)] bg-black/30 p-2'>
      <div className='flex items-baseline justify-between'>
        <span className='text-xs text-[var(--aio-subtitle)]'>{label}</span>
        <span className='text-sm font-semibold text-white'>
          {value.toLocaleString()}
          <span className='ml-0.5 text-xs text-[var(--aio-subtitle)]'>{unit}</span>
        </span>
      </div>
      {typeof bar === 'number' ? (
        <div className='mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10'>
          <div
            className='h-full bg-[var(--aio-accent)]'
            style={{ width: `${Math.min(100, Math.max(0, bar))}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}
