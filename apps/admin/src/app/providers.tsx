'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { queryClient } from '@/libs/query/queryClient'
import { AlertHost } from '@/shared/components/AlertHost'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AlertHost />
    </QueryClientProvider>
  )
}
