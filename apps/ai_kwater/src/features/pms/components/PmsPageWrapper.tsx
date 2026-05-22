'use client'

import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

interface Props {
  children: ReactNode
  className?: string
}

export function PmsPageWrapper({ children, className }: Props) {
  return (
    <div
      className={cn('relative -m-6 min-h-screen space-y-4 p-6 text-white', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(16,19,32,0.94) 0%, rgba(10,15,26,0.97) 100%), url(/pms/main-background.png) center/cover fixed',
      }}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[url(/pms/bg.png)] bg-center bg-no-repeat opacity-10'
      />
      <div className='relative'>{children}</div>
    </div>
  )
}
