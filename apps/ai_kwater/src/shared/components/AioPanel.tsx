'use client'

import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

interface Props {
  children: ReactNode
  className?: string
  /** absolute 위치 등 inline style 가 필요한 경우 */
  style?: React.CSSProperties
}

/**
 * 원본 정수장 다크 블루 반투명 패널 wrapper.
 * Dashboard / OperationBoard 전용.
 */
export function AioPanel({ children, className, style }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] text-white',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}
