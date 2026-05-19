import { http, HttpResponse } from 'msw'

import {
  seedMonitoringByHost,
  seedMonitoringLatest,
  seedResources,
} from '@/mocks/data/performance'
import type {
  ResourceInfo,
  UpdateResourceNamePayload,
} from '@/features/performance/types/performance'

let resources: ResourceInfo[] = [...seedResources]

export const performanceHandlers = [
  http.get('*/resources/info', () => {
    return HttpResponse.json({ resources })
  }),

  http.put('*/resources/info/:hostname', async ({ params, request }) => {
    const hostname = params.hostname as string
    const payload = (await request.json()) as UpdateResourceNamePayload
    resources = resources.map((r) =>
      r.systemInfo.hostname === hostname
        ? { ...r, systemInfo: { ...r.systemInfo, name: payload.name } }
        : r,
    )
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('*/resources/monitoring/latest', () => {
    return HttpResponse.json({ monitoring: seedMonitoringLatest })
  }),

  http.get('*/resources/monitoring/:hostname', ({ params }) => {
    const hostname = params.hostname as string
    return HttpResponse.json({ monitoring: seedMonitoringByHost[hostname] ?? [] })
  }),
]
