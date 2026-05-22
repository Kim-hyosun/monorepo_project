'use client'

import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

interface Props {
  children: ReactNode
  className?: string
}

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function EmsPageWrapper({ children, className }: Props) {
  return (
    <div
      className={cn('-m-6 min-h-screen space-y-4 p-6 text-white', className)}
      style={DARK_WRAPPER_STYLE}
    >
      {children}
    </div>
  )
}
