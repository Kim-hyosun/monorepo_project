'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ReservoirInstantItem } from '@/features/ems/types/ems'

interface Props {
  items: ReservoirInstantItem[]
}

export function LevelInstantList({ items }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>배수지별 수위 순시</h3>
      <ul className='flex flex-wrap gap-2'>
        {items.map((it) => (
          <li
            key={it.name}
            className='flex items-baseline gap-2 rounded-full border border-[var(--aio-panel-border)] bg-black/30 px-4 py-2'
          >
            <span className='text-xs text-[var(--aio-subtitle)]'>{it.name}</span>
            <span
              className='text-base font-semibold text-white'
              style={{ textShadow: 'var(--aio-text-glow)' }}
            >
              {it.levelM.toFixed(2)}
            </span>
            <span className='text-xs text-[var(--aio-subtitle)]'>{it.unit}</span>
          </li>
        ))}
      </ul>
    </AioPanel>
  )
}
