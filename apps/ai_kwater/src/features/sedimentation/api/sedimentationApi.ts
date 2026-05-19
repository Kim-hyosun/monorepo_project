import { api } from '@/libs/axios/instance'
import type {
  PutOperationPayload,
  PutSettingsPayload,
  SedimentationLatestResponse,
} from '@/features/sedimentation/types/sedimentation'

export const sedimentationApi = {
  getLatest: () =>
    api.get<SedimentationLatestResponse>('/sedimentation/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/sedimentation/control/operation', payload).then((res) => res.data),
  putSettings: (payload: PutSettingsPayload) =>
    api.put<void>('/sedimentation/control/settings', payload).then((res) => res.data),
}
