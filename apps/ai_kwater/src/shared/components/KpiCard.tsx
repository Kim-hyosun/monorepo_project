'use client'

import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

interface Props {
  label: string
  value: ReactNode
  unit?: string
  highlight?: boolean
  /** 'light' = shadcn 디폴트(기본). 'dark' = 원본 다크블루 패널 (Dashboard/OperationBoard 전용) */
  variant?: 'light' | 'dark'
}

export function KpiCard({ label, value, unit, highlight, variant = 'light' }: Props) {
  const isDark = variant === 'dark'
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isDark
          ? 'border-[var(--aio-panel-border)] bg-[var(--aio-panel)] text-white'
          : highlight
            ? 'border-primary/40 bg-primary/5'
            : '',
        !isDark && highlight ? 'border-primary/40 bg-primary/5' : '',
      )}
    >
      <div
        className={cn(
          'text-xs',
          isDark ? 'text-[var(--aio-subtitle)]' : 'text-muted-foreground',
        )}
      >
        {label}
      </div>
      <div className='mt-1 flex items-baseline gap-1'>
        <span
          className={cn(
            'text-xl font-semibold',
            isDark && highlight ? '[text-shadow:var(--aio-text-glow)]' : '',
          )}
        >
          {value === null || value === undefined || value === '' ? '-' : value}
        </span>
        {unit ? (
          <span
            className={cn('text-xs', isDark ? 'text-[var(--aio-subtitle)]' : 'text-muted-foreground')}
          >
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  )
}
