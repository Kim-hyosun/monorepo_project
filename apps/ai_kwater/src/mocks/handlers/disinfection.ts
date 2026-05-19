import { http, HttpResponse } from 'msw'

import { seedDisinfectionLatest } from '@/mocks/data/disinfection'
import type { PutOperationPayload } from '@/features/disinfection/types/disinfection'

let latest = { ...seedDisinfectionLatest }

export const disinfectionHandlers = [
  http.get('*/disinfection/latest', () => HttpResponse.json({ latest })),

  http.put('*/disinfection/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/disinfection/control/dose/:stage', async ({ params, request }) => {
    const stage = params.stage as 'pre' | 'mid' | 'after'
    const { cl_dose } = (await request.json()) as { cl_dose: number }
    latest = {
      ...latest,
      stages: {
        ...latest.stages,
        [stage]: { ...latest.stages[stage], cl_dose },
      },
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
