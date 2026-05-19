'use client'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

/**
 * 원본 operation_mode: 0=AI분석, 1=부분AI, 2=AI.
 * (Vue 페이지의 control_box_operation 토글)
 */
export type OperationMode = 0 | 1 | 2

interface Props {
  value: OperationMode | null
  onChange: (mode: OperationMode) => void
  disabled?: boolean
  variant?: 'light' | 'dark'
}

const OPTIONS: { value: OperationMode; label: string }[] = [
  { value: 2, label: 'AI' },
  { value: 1, label: '부분AI' },
  { value: 0, label: 'AI분석' },
]

export function ModeToggleBar({ value, onChange, disabled, variant = 'light' }: Props) {
  const isDark = variant === 'dark'
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md border p-1',
        isDark ? 'border-[var(--aio-panel-border)] bg-[var(--aio-panel)]' : '',
      )}
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value
        if (isDark) {
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => onChange(opt.value)}
              disabled={disabled}
              className={cn(
                'rounded px-3 py-1 text-xs font-medium transition disabled:opacity-50',
                active
                  ? 'bg-[var(--aio-accent)]/30 text-white'
                  : 'text-[var(--aio-subtitle)] hover:bg-white/10',
              )}
              style={active ? { textShadow: 'var(--aio-text-glow)' } : undefined}
            >
              {opt.label}
            </button>
          )
        }
        return (
          <Button
            key={opt.value}
            size='sm'
            variant={active ? 'default' : 'ghost'}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
          >
            {opt.label}
          </Button>
        )
      })}
    </div>
  )
}
