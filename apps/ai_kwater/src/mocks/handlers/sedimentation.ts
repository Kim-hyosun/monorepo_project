import { http, HttpResponse } from 'msw'

import { seedSedimentationLatest } from '@/mocks/data/sedimentation'
import type {
  PutOperationPayload,
  PutSettingsPayload,
} from '@/features/sedimentation/types/sedimentation'

let latest = { ...seedSedimentationLatest }

export const sedimentationHandlers = [
  http.get('*/sedimentation/latest', () => HttpResponse.json({ latest })),

  http.put('*/sedimentation/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/sedimentation/control/settings', async ({ request }) => {
    const payload = (await request.json()) as PutSettingsPayload
    latest = {
      ...latest,
      sd_time: payload.sd_time,
      sd_purge_interval: payload.sd_purge_interval,
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
