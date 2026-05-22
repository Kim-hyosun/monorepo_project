'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { Zone } from '@/features/ems/types/ems'

interface Props {
  zone: Zone
}

export function ZoneInfoPopup({ zone }: Props) {
  const max = Math.max(...zone.top3.map((f) => f.usageKwh), 1)
  return (
    <AioPanel className='absolute right-4 top-4 z-10 w-72 p-3 shadow-lg'>
      <div className='mb-2 flex items-baseline justify-between'>
        <span className='text-sm font-semibold text-white' style={{ textShadow: 'var(--aio-text-glow)' }}>
          {zone.code} 주요 설비 TOP 3
        </span>
        <span className='text-xs text-[var(--aio-subtitle)]'>
          전력소비{' '}
          <span className='text-white'>{zone.totalKwh.toLocaleString()}</span>
          <span className='ml-0.5'>kWh</span>
        </span>
      </div>
      <ul className='space-y-2'>
        {zone.top3.map((f) => (
          <li key={f.name} className='text-xs'>
            <div className='mb-1 flex justify-between'>
              <span className='text-white'>{f.name}</span>
              <span className='text-[var(--aio-subtitle)]'>
                {f.usageKwh.toLocaleString()}
                <span className='ml-0.5'>kWh</span>
              </span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/10'>
              <div
                className='h-full bg-[var(--aio-accent)]'
                style={{ width: `${(f.usageKwh / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </AioPanel>
  )
}
