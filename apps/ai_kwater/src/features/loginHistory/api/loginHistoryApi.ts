import { api } from '@/libs/axios/instance'
import type { LoginHistoryResponse } from '@/features/loginHistory/types/loginHistory'

export const loginHistoryApi = {
  /** 원본 HISTORY action: GET /login */
  list: () => api.get<LoginHistoryResponse>('/login').then((res) => res.data),
}
