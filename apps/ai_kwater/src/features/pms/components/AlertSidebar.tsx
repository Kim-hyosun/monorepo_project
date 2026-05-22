'use client'

import { cn } from '@/shared/utils/cn'
import type { PmsAlert } from '@/features/pms/types/pms'

interface Props {
  alerts: PmsAlert[]
  className?: string
}

const STATUS_COLOR: Record<string, string> = {
  경보: 'text-rose-400 border-rose-400/40',
  주의: 'text-amber-300 border-amber-300/40',
}

export function AlertSidebar({ alerts, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-3',
        className,
      )}
    >
      <h3
        className='mb-2 text-sm font-semibold text-white'
        style={{ textShadow: 'var(--aio-text-glow)' }}
      >
        경보 / 주의 이력
      </h3>
      <ul className='space-y-2'>
        {alerts.length === 0 ? (
          <li className='text-xs text-[var(--aio-subtitle)]'>이력 없음</li>
        ) : (
          alerts.map((a) => (
            <li
              key={a.num}
              className={cn(
                'rounded border bg-black/20 px-2 py-1.5 text-xs',
                STATUS_COLOR[a.status] ?? 'border-white/10 text-white',
              )}
            >
              <div className='flex justify-between'>
                <span className='font-medium'>{a.list}</span>
                <span>{a.status}</span>
              </div>
              <div className='mt-0.5 flex justify-between text-[var(--aio-subtitle)]'>
                <span>{a.info}</span>
                <span>{a.time}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
