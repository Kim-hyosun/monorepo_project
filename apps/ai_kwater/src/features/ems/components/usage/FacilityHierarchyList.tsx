'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { FacilityCategory } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  categories: FacilityCategory[]
  selectedIndex: number
  onSelect: (idx: number) => void
}

export function FacilityHierarchyList({ categories, selectedIndex, onSelect }: Props) {
  const selected = categories[selectedIndex]
  return (
    <div className='grid grid-cols-2 gap-3'>
      <AioPanel className='p-4'>
        <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>시설 현황</h3>
        <ul className='space-y-2'>
          {categories.map((c, i) => {
            const active = i === selectedIndex
            return (
              <li key={c.name}>
                <button
                  type='button'
                  onClick={() => onSelect(i)}
                  className={cn(
                    'w-full rounded border px-3 py-2 text-left text-xs font-medium transition',
                    active
                      ? 'border-[var(--aio-accent)] bg-[var(--aio-accent)]/20 text-white'
                      : 'border-[var(--aio-panel-border)] bg-black/30 text-white/70 hover:bg-white/10',
                  )}
                  style={active ? { textShadow: 'var(--aio-text-glow)' } : undefined}
                >
                  {c.name}
                </button>
              </li>
            )
          })}
        </ul>
      </AioPanel>

      <AioPanel className='p-4'>
        <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>
          설비 목록 <span className='ml-2 text-white'>{selected?.name ?? '-'}</span>
        </h3>
        <ul className='space-y-2'>
          {selected?.facilities.map((f) => (
            <li
              key={f}
              className='rounded border border-[var(--aio-panel-border)] bg-black/30 px-3 py-2 text-xs text-white'
            >
              {f}
            </li>
          ))}
        </ul>
      </AioPanel>
    </div>
  )
}
