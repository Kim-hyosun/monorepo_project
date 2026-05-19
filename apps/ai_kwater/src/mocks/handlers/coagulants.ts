import { http, HttpResponse } from 'msw'

import { seedCoagulantsLatest } from '@/mocks/data/coagulants'
import type {
  CgSimulationInput,
  CgSimulationResult,
  PutCgDosagePayload,
  PutOperationPayload,
} from '@/features/coagulants/types/coagulants'

let latest = { ...seedCoagulantsLatest }

export const coagulantsHandlers = [
  http.get('*/coagulants/latest', () => HttpResponse.json({ latest })),

  http.put('*/coagulants/control/operation', async ({ request }) => {
    const payload = (await request.json()) as PutOperationPayload
    latest = { ...latest, operation_mode: payload.operation_mode }
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/coagulants/control/cgDosage', async ({ request }) => {
    const payload = (await request.json()) as PutCgDosagePayload
    latest = { ...latest, cg_dose: payload.cg_dose }
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/coagulants/simulate', async ({ request }) => {
    const input = (await request.json()) as CgSimulationInput
    // 입력값 비례 dummy 계산
    const result: CgSimulationResult = {
      recommended_dose: Number((input.turbidity * 8 + input.alkalinity * 0.15).toFixed(2)),
      expected_residual_turbidity: Number((input.turbidity * 0.05).toFixed(2)),
      expected_ph: Number(Math.max(0, input.ph - 0.3).toFixed(2)),
    }
    return HttpResponse.json(result)
  }),
]
