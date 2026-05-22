'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'

import { queryClient } from '@/libs/query/queryClient'
import { AlertHost } from '@/shared/components/AlertHost'

const MSW_ENABLED = process.env.NEXT_PUBLIC_USE_MSW === 'true'

/** MSW init 3초 안에 안 끝나면 children 강제 렌더 (안전장치) */
const MSW_TIMEOUT_MS = 3_000

export default function Providers({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(!MSW_ENABLED)
  const [mswFailed, setMswFailed] = useState(false)

  useEffect(() => {
    if (!MSW_ENABLED) return
    let cancelled = false

    const timeoutId = setTimeout(() => {
      if (cancelled) return
      console.warn('[MSW] init timeout — proceeding')
      setMswFailed(true)
      setMswReady(true)
    }, MSW_TIMEOUT_MS)

    import('@/mocks/browser')
      .then(async ({ worker }) => {
        try {
          await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
        } catch (err) {
          console.error('[MSW] worker.start failed', err)
          if (!cancelled) setMswFailed(true)
        }
        if (!cancelled) {
          clearTimeout(timeoutId)
          setMswReady(true)
        }
      })
      .catch((err) => {
        console.error('[MSW] import failed', err)
        if (!cancelled) {
          clearTimeout(timeoutId)
          setMswFailed(true)
          setMswReady(true)
        }
      })

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  if (!mswReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#101320',
          color: '#c3eaff',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 13 }}>준비 중…</div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {mswFailed ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#7c2d12',
            color: '#fed7aa',
            padding: '6px 12px',
            fontSize: 11,
            textAlign: 'center',
          }}
        >
          ⚠ MSW mock 서버 시작 실패 — 새로고침(⌘R)으로 재시도
        </div>
      ) : null}
      {children}
      <AlertHost />
    </QueryClientProvider>
  )
}
