import { http, HttpResponse } from 'msw'

import { seedNetworkConfig } from '@/mocks/data/network'
import type { NetworkConfig } from '@/features/network/types/network'

let config: NetworkConfig = { ...seedNetworkConfig }

export const networkHandlers = [
  http.get('*/config', () => {
    return HttpResponse.json({ config })
  }),

  http.put('*/config', async ({ request }) => {
    const next = (await request.json()) as NetworkConfig
    config = { ...config, ...next }
    return HttpResponse.json({ config })
  }),
]
