import { http, HttpResponse } from 'msw'

import { seedMixingLatest } from '@/mocks/data/mixing'
import type {
  PutMtccPayload,
  PutOperationPayload,
} from '@/features/mixing/types/mixing'

let latest = { ...seedMixingLatest }

export const mixingHandlers = [
  http.get('*/mixing/latest', () => HttpResponse.json({ latest })),

  http.put('*/mixing/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/mixing/control/mtcc', async ({ request }) => {
    const payload = (await request.json()) as PutMtccPayload
    latest = { ...latest, g_value: payload.g_value, mtcc_time: payload.mtcc_time }
    return new HttpResponse(null, { status: 204 })
  }),
]
