import { http, HttpResponse } from 'msw'

import { seedFilterLatest } from '@/mocks/data/filter'
import type {
  PutBackwashPayload,
  PutOperationPayload,
} from '@/features/filter/types/filter'

let latest = { ...seedFilterLatest }

export const filterHandlers = [
  http.get('*/filter/latest', () => HttpResponse.json({ latest })),

  http.put('*/filter/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/filter/control/backwash', async ({ request }) => {
    const payload = (await request.json()) as PutBackwashPayload
    latest = { ...latest, bw_interval: payload.bw_interval }
    return new HttpResponse(null, { status: 204 })
  }),
]
