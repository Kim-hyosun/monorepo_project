import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/** 테스트 전역 — MSW node server. setup.ts 에서 lifecycle 관리. */
export const server = setupServer(...handlers)
