'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SujiInstantValue } from '@/features/ems/types/ems'

interface Props {
  items: SujiInstantValue[]
}

export function InstantValueTable({ items }: Props) {
  return (
    <AioPanel className='relative overflow-hidden p-4'>
      <style>{`
        @keyframes wf-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>주요 인자 순시값</h3>

      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-12'
        style={{
          background: 'linear-gradient(180deg, transparent, var(--aio-accent), transparent)',
          opacity: 0.15,
          animation: 'wf-scan 4s linear infinite',
        }}
      />

      <ul className='relative space-y-2'>
        {items.map((item) => (
          <li
            key={item.name}
            className='flex items-baseline justify-between rounded border border-[var(--aio-panel-border)] bg-black/30 px-3 py-2'
          >
            <span className='text-xs text-[var(--aio-subtitle)]'>{item.name}</span>
            <span>
              <span
                className='text-base font-semibold text-white'
                style={{ textShadow: 'var(--aio-text-glow)' }}
              >
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
              <span className='ml-1 text-xs text-[var(--aio-subtitle)]'>{item.unit}</span>
            </span>
          </li>
        ))}
      </ul>
    </AioPanel>
  )
}
