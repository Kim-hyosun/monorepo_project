import { api } from '@/libs/axios/instance'
import type {
  CgSimulationInput,
  CgSimulationResult,
  CoagulantsLatestResponse,
  PutCgDosagePayload,
  PutOperationPayload,
} from '@/features/coagulants/types/coagulants'

export const coagulantsApi = {
  getLatest: () => api.get<CoagulantsLatestResponse>('/coagulants/latest').then((res) => res.data),
  putOperation: (payload: PutOperationPayload) =>
    api.put<void>('/coagulants/control/operation', payload).then((res) => res.data),
  putDosage: (payload: PutCgDosagePayload) =>
    api.put<void>('/coagulants/control/cgDosage', payload).then((res) => res.data),
  simulate: (payload: CgSimulationInput) =>
    api.post<CgSimulationResult>('/coagulants/simulate', payload).then((res) => res.data),
}
