'use client'

import { cn } from '@/shared/utils/cn'
import type { PumpMotor } from '@/features/pms/types/pms'

interface Props {
  motors: PumpMotor[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}

const STATUS_DOT: Record<PumpMotor['status'], string> = {
  normal: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-rose-500',
  off: 'bg-slate-500',
}

export function MotorList({ motors, selectedId, onSelect, className }: Props) {
  return (
    <ul
      className={cn(
        'overflow-y-auto rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)]',
        className,
      )}
    >
      {motors.map((m) => {
        const selected = m.id === selectedId
        return (
          <li key={m.id}>
            <button
              type='button'
              onClick={() => onSelect(m.id)}
              className={cn(
                'flex w-full items-center gap-2 border-b border-[var(--aio-panel-border)] px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                selected ? 'bg-[var(--aio-accent)]/15 text-white' : 'text-[var(--aio-subtitle)]',
              )}
            >
              <span className={cn('inline-block h-2 w-2 rounded-full', STATUS_DOT[m.status])} />
              <span className='flex-1 truncate'>{m.name}</span>
              {m.alarm ? <span className='text-xs text-rose-400'>!</span> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
