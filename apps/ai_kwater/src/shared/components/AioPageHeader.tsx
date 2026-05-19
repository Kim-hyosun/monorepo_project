'use client'

import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

interface Props {
  title: string
  description?: string
  actions?: ReactNode
  /** 가운데 정렬 (OperationBoard 같은 페이지) */
  center?: boolean
}

/**
 * 원본 정수장 컬럼 헤더 그라데이션 + 블루 글로우 텍스트.
 * Dashboard / OperationBoard 전용.
 */
export function AioPageHeader({ title, description, actions, center }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-md px-6 py-3',
        center ? 'justify-center text-center' : 'justify-between',
      )}
      style={{ backgroundImage: 'var(--aio-divider-gradient)' }}
    >
      <div className={center ? '' : 'flex-1'}>
        <h1
          className='text-2xl font-semibold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {title}
        </h1>
        {description ? (
          <p className='mt-1 text-sm text-[var(--aio-subtitle)]'>{description}</p>
        ) : null}
      </div>
      {actions && !center ? <div className='flex items-center gap-2'>{actions}</div> : null}
    </div>
  )
}
