import { http, HttpResponse } from 'msw'

import { seedReceivingLatest } from '@/mocks/data/receiving'
import type {
  PutLevelPayload,
  PutOperationPayload,
} from '@/features/receiving/types/receiving'

let latest = { ...seedReceivingLatest }

export const receivingHandlers = [
  http.get('*/receiving/latest', () => HttpResponse.json({ latest })),

  http.put('*/receiving/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/receiving/control/level', async ({ request }) => {
    const payload = (await request.json()) as PutLevelPayload
    latest = {
      ...latest,
      h_target_le_max: payload.h_target_le_max,
      h_target_le_min: payload.h_target_le_min,
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
