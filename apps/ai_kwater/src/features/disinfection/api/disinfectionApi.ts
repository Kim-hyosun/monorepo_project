import { api } from '@/libs/axios/instance'
import type {
  DisinfectionLatestResponse,
  PutClDosePayload,
  PutOperationPayload,
} from '@/features/disinfection/types/disinfection'

export const disinfectionApi = {
  getLatest: () =>
    api.get<DisinfectionLatestResponse>('/disinfection/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/disinfection/control/operation', payload).then((res) => res.data),
  putClDose: (payload: PutClDosePayload) =>
    api.put<void>(`/disinfection/control/dose/${payload.stage}`, { cl_dose: payload.cl_dose }).then((res) => res.data),
}
