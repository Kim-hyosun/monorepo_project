// 원본: 성남정수장/src/store/aio/modules/raw/index.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type { RawLatestResponse } from '@/features/raw/types/raw'

export const rawApi = {
  /** GET /raw/latest — 원수 최신 정보 */
  getLatest: () => api.get<RawLatestResponse>('/raw/latest').then((res) => res.data),
}
