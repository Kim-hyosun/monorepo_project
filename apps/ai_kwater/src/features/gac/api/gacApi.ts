import { api } from '@/libs/axios/instance'
import type {
  GacLatestResponse,
  PutBackwashPayload,
  PutOperationPayload,
} from '@/features/gac/types/gac'

export const gacApi = {
  getLatest: () => api.get<GacLatestResponse>('/gac/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/gac/control/operation', payload).then((res) => res.data),
  putBackwash: (payload: PutBackwashPayload) =>
    api.put<void>('/gac/control/backwash', payload).then((res) => res.data),
}
