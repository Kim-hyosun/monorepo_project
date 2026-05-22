'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { PumpRuntimeRow } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  rows: PumpRuntimeRow[]
}

export function PumpRuntimeBarChart({ rows }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>가동 시간대</h3>
      <ul className='space-y-2'>
        {rows.map((row) => (
          <li key={row.name} className='flex items-center gap-3'>
            <span className='w-20 shrink-0 text-xs text-[var(--aio-subtitle)]'>{row.name}</span>
            <div className='flex h-5 flex-1 overflow-hidden rounded border border-[var(--aio-panel-border)] bg-black/40'>
              {row.segments.map((seg, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-full',
                    seg.on ? 'bg-[var(--aio-accent)]' : 'bg-white/10',
                  )}
                  style={{ width: `${seg.duration}%` }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className='mt-3 flex items-center gap-4 text-xs text-[var(--aio-subtitle)]'>
        <span className='inline-flex items-center gap-1'>
          <span className='inline-block h-2 w-3 rounded-sm bg-[var(--aio-accent)]' /> 가동
        </span>
        <span className='inline-flex items-center gap-1'>
          <span className='inline-block h-2 w-3 rounded-sm bg-white/10' /> 유휴
        </span>
      </div>
    </AioPanel>
  )
}
