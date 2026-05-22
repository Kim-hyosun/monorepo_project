'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import type { PumpPerformGranularity } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  granularity: PumpPerformGranularity
  onGranularityChange: (g: PumpPerformGranularity) => void
  from: string
  to: string
  onFromChange: (s: string) => void
  onToChange: (s: string) => void
  onSubmit: () => void
  disabled?: boolean
}

const OPTIONS: { value: PumpPerformGranularity; label: string }[] = [
  { value: 'hour', label: '시' },
  { value: 'day', label: '일' },
  { value: 'month', label: '월' },
  { value: 'year', label: '년' },
]

export function UsageDateRange({
  granularity,
  onGranularityChange,
  from,
  to,
  onFromChange,
  onToChange,
  onSubmit,
  disabled,
}: Props) {
  return (
    <AioPanel className='p-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex items-center gap-1 rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-1'>
          {OPTIONS.map((o) => {
            const active = o.value === granularity
            return (
              <button
                key={o.value}
                type='button'
                onClick={() => onGranularityChange(o.value)}
                className={cn(
                  'rounded px-3 py-1 text-xs font-medium transition',
                  active
                    ? 'bg-[var(--aio-accent)]/30 text-white'
                    : 'text-[var(--aio-subtitle)] hover:bg-white/10',
                )}
              >
                {o.label}
              </button>
            )
          })}
        </div>
        <Input
          type='date'
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className='h-9 w-40 border-[var(--aio-panel-border)] bg-transparent text-white'
        />
        <span className='text-[var(--aio-subtitle)]'>~</span>
        <Input
          type='date'
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className='h-9 w-40 border-[var(--aio-panel-border)] bg-transparent text-white'
        />
        <Button size='sm' onClick={onSubmit} disabled={disabled}>
          조회
        </Button>
      </div>
    </AioPanel>
  )
}
