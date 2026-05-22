'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ReservoirDistributionItem } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  items: ReservoirDistributionItem[]
  selected: string
}

export function LevelDistributionChart({ items, selected }: Props) {
  const max = Math.max(...items.map((i) => i.levelM), 1)
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>배수지별 수위 분포</h3>
      <ul className='space-y-2 text-xs'>
        {items.map((it) => {
          const widthPct = (it.levelM / max) * 100
          const isSelected = it.name === selected
          const color =
            it.capacityPct < 30 ? '#f87171' : it.capacityPct < 70 ? '#fbbf24' : '#34d399'
          return (
            <li key={it.name} className='space-y-0.5'>
              <div className='flex items-center justify-between'>
                <span
                  className={cn(
                    'truncate',
                    isSelected ? 'font-semibold text-white' : 'text-[var(--aio-subtitle)]',
                  )}
                  style={isSelected ? { textShadow: 'var(--aio-text-glow)' } : undefined}
                >
                  {it.name}
                </span>
                <span className='text-[var(--aio-subtitle)]'>
                  <span className='text-white'>{it.levelM.toFixed(2)}</span>
                  <span className='ml-0.5'>m · {it.capacityPct}%</span>
                </span>
              </div>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/10'>
                <div
                  className='h-full transition-all'
                  style={{ width: `${widthPct}%`, backgroundColor: color }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </AioPanel>
  )
}
