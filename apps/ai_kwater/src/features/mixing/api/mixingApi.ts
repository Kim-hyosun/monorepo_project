import { api } from '@/libs/axios/instance'
import type {
  MixingLatestResponse,
  PutMtccPayload,
  PutOperationPayload,
} from '@/features/mixing/types/mixing'

export const mixingApi = {
  getLatest: () => api.get<MixingLatestResponse>('/mixing/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/mixing/control/operation', payload).then((res) => res.data),
  putMtcc: (payload: PutMtccPayload) =>
    api.put<void>('/mixing/control/mtcc', payload).then((res) => res.data),
}
