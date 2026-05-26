'use client'

import * as React from 'react'

import { cn } from '@/shared/utils/cn'

interface Option<T extends string> {
  value: T
  label: React.ReactNode
}

interface Props<T extends string> {
  name: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  className?: string
  disabled?: boolean
}

/** Segmented radio control — 성별 / 음양력 같은 2~4 옵션 토글에 사용. native radio + visual button. */
export function RadioSegment<T extends string>({
  name,
  options,
  value,
  onChange,
  className,
  disabled,
}: Props<T>) {
  return (
    <div
      role='radiogroup'
      data-slot='radio-segment'
      className={cn(
        'border-input bg-background inline-flex h-10 items-center gap-1 rounded-md border p-1 shadow-sm',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <label
            key={opt.value}
            className={cn(
              'relative flex-1 cursor-pointer rounded px-3 py-1.5 text-center text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/60'
            )}
          >
            <input
              type='radio'
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className='sr-only'
            />
            {opt.label}
          </label>
        )
      })}
    </div>
  )
}
