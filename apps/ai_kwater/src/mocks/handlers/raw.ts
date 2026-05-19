import { http, HttpResponse } from 'msw'

import { seedRawLatest } from '@/mocks/data/raw'

export const rawHandlers = [
  http.get('*/raw/latest', () => HttpResponse.json({ latest: seedRawLatest })),
]
