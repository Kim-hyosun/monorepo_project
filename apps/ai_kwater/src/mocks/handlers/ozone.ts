import { http, HttpResponse } from 'msw'

import { seedOzoneLatest } from '@/mocks/data/ozone'
import type { PutOperationPayload } from '@/features/ozone/types/ozone'

let latest = { ...seedOzoneLatest }

export const ozoneHandlers = [
  http.get('*/ozone/latest', () => HttpResponse.json({ latest })),

  http.put('*/ozone/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),
]
