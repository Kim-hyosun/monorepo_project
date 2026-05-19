// 원본: 성남정수장/src/store/aio/modules/receiving/index.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type {
  PutLevelPayload,
  PutOperationPayload,
  ReceivingLatestResponse,
} from '@/features/receiving/types/receiving'

export const receivingApi = {
  getLatest: () => api.get<ReceivingLatestResponse>('/receiving/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/receiving/control/operation', payload).then((res) => res.data),
  putLevel: (payload: PutLevelPayload) =>
    api.put<void>('/receiving/control/level', payload).then((res) => res.data),
}
