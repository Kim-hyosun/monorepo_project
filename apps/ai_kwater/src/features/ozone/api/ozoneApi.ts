// 원본: 성남정수장/src/store/aio/modules/ozone/index.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type { OzoneLatestResponse, PutOperationPayload } from '@/features/ozone/types/ozone'

export const ozoneApi = {
  getLatest: () => api.get<OzoneLatestResponse>('/ozone/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/ozone/control/operation', payload).then((res) => res.data),
}
