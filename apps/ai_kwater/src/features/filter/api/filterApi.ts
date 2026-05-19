import { api } from '@/libs/axios/instance'
import type {
  FilterLatestResponse,
  PutBackwashPayload,
  PutOperationPayload,
} from '@/features/filter/types/filter'

export const filterApi = {
  getLatest: () => api.get<FilterLatestResponse>('/filter/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/filter/control/operation', payload).then((res) => res.data),
  putBackwash: (payload: PutBackwashPayload) =>
    api.put<void>('/filter/control/backwash', payload).then((res) => res.data),
}
