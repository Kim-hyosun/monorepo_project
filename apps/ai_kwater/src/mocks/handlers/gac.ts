import { http, HttpResponse } from 'msw'

import { seedGacLatest } from '@/mocks/data/gac'
import type { PutBackwashPayload, PutOperationPayload } from '@/features/gac/types/gac'

let latest = { ...seedGacLatest }

export const gacHandlers = [
  http.get('*/gac/latest', () => HttpResponse.json({ latest })),

  http.put('*/gac/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/gac/control/backwash', async ({ request }) => {
    const payload = (await request.json()) as PutBackwashPayload
    latest = { ...latest, bw_interval: payload.bw_interval }
    return new HttpResponse(null, { status: 204 })
  }),
]
