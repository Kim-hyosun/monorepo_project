// 원본: 성남정수장/src/store/pms/modules/monitor*.js → axios 함수형. 단일 엔드포인트로 통합.

import { api } from '@/libs/axios/instance'
import type {
  PmsAlertsResponse,
  PmsMotorDetailResponse,
  PmsMotorsResponse,
  PmsProcessStatusResponse,
} from '@/features/pms/types/pms'

export const pmsApi = {
  listMotors: () => api.get<PmsMotorsResponse>('/pms/motors').then((res) => res.data),
  getMotor: (id: string) =>
    api.get<PmsMotorDetailResponse>(`/pms/motors/${id}`).then((res) => res.data),
  listAlerts: () => api.get<PmsAlertsResponse>('/pms/alerts').then((res) => res.data),
  markAlertRead: (num: number) =>
    api.put<{ ok: true }>(`/pms/alerts/${num}/read`).then((res) => res.data),
  getProcessStatus: () =>
    api.get<PmsProcessStatusResponse>('/pms/process-status').then((res) => res.data),
}
