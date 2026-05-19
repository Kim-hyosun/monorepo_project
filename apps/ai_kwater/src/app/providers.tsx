'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'

import { queryClient } from '@/libs/query/queryClient'
import { AlertHost } from '@/shared/components/AlertHost'

const MSW_ENABLED = process.env.NEXT_PUBLIC_USE_MSW === 'true'

export default function Providers({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(!MSW_ENABLED)

  useEffect(() => {
    if (!MSW_ENABLED) return
    let cancelled = false
    import('@/mocks/browser').then(async ({ worker }) => {
      await worker.start({ onUnhandledRequest: 'bypass' })
      if (!cancelled) setMswReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!mswReady) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AlertHost />
    </QueryClientProvider>
  )
}
