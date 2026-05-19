import { http, HttpResponse } from 'msw'

import { seedLoginHistory } from '@/mocks/data/loginHistory'

export const loginHistoryHandlers = [
  http.get('*/login', () => {
    return HttpResponse.json({ login: seedLoginHistory })
  }),
]
