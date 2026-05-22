import { http, HttpResponse } from 'msw'

import { seedAlerts, seedMotors, seedProcess } from '@/mocks/data/pms'

export const pmsHandlers = [
  http.get('*/pms/motors', () => HttpResponse.json({ motors: seedMotors })),

  http.get('*/pms/motors/:id', ({ params }) => {
    const motor = seedMotors.find((m) => m.id === params.id)
    if (!motor) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ motor })
  }),

  http.get('*/pms/alerts', () => HttpResponse.json({ alerts: seedAlerts })),

  http.get('*/pms/process-status', () => HttpResponse.json({ process: seedProcess })),
]
