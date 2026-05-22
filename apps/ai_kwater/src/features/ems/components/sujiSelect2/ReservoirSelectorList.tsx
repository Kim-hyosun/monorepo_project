'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import { cn } from '@/shared/utils/cn'

interface Props {
  reservoirs: string[]
  selected: string
  onSelect: (name: string) => void
}

export function ReservoirSelectorList({ reservoirs, selected, onSelect }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>배수지 현황</h3>
      <ul className='space-y-2'>
        {reservoirs.map((r) => {
          const active = r === selected
          return (
            <li key={r}>
              <button
                type='button'
                onClick={() => onSelect(r)}
                className={cn(
                  'w-full rounded border px-3 py-2 text-left text-xs font-medium transition',
                  active
                    ? 'border-[var(--aio-accent)] bg-[var(--aio-accent)]/20 text-white'
                    : 'border-[var(--aio-panel-border)] bg-black/30 text-white/70 hover:bg-white/10',
                )}
                style={active ? { textShadow: 'var(--aio-text-glow)' } : undefined}
              >
                {r}
              </button>
            </li>
          )
        })}
      </ul>
    </AioPanel>
  )
}
