import { http, HttpResponse } from 'msw'

import {
  markAlertReadInMemory,
  pushNewAlert,
  seedAlerts,
  seedMotors,
  seedProcess,
} from '@/mocks/data/pms'

const PUSH_INTERVAL_MS = 30_000
const PUSH_PROBABILITY = 0.5
let lastPushAt = 0

/** GET /pms/alerts 호출 시점에 30s 경과 + 50% 확률로 신규 알람 1건 자동 push */
function maybePushAlert() {
  const now = Date.now()
  if (now - lastPushAt < PUSH_INTERVAL_MS) return
  lastPushAt = now
  if (Math.random() < PUSH_PROBABILITY) {
    pushNewAlert()
  }
}

export const pmsHandlers = [
  http.get('*/pms/motors', () => HttpResponse.json({ motors: seedMotors })),

  http.get('*/pms/motors/:id', ({ params }) => {
    const motor = seedMotors.find((m) => m.id === params.id)
    if (!motor) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ motor })
  }),

  http.get('*/pms/alerts', () => {
    maybePushAlert()
    return HttpResponse.json({ alerts: seedAlerts })
  }),

  http.put('*/pms/alerts/:num/read', ({ params }) => {
    const num = Number(params.num)
    markAlertReadInMemory(num)
    return HttpResponse.json({ ok: true })
  }),

  http.get('*/pms/process-status', () => HttpResponse.json({ process: seedProcess })),
]
