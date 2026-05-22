import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

/** 매 테스트마다 새 QueryClient 생성 — 캐시 격리. retry off / staleTime 0. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: { retry: false },
    },
  })
}

interface Options extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

/** QueryClientProvider 로 감싼 render. */
export function renderWithProviders(ui: ReactElement, opt: Options = {}) {
  const client = opt.queryClient ?? createTestQueryClient()
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return { ...render(ui, { wrapper: Wrapper, ...opt }), queryClient: client }
}
