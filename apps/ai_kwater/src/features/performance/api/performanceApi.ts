// 원본: 성남정수장/src/store/aio/modules/performance.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type {
  MonitoringLatestResponse,
  MonitoringResponse,
  ResourcesInfoResponse,
  UpdateResourceNamePayload,
} from '@/features/performance/types/performance'

export const performanceApi = {
  /** 원본 GET_RESOURCES_INFO: GET /resources/info */
  listResources: () =>
    api.get<ResourcesInfoResponse>('/resources/info').then((res) => res.data),

  /** 원본 PUT_NAME: PUT /resources/info/:hostname */
  updateResourceName: (hostname: string, payload: UpdateResourceNamePayload) =>
    api.put<void>(`/resources/info/${hostname}`, payload).then((res) => res.data),

  /** 원본 GET_RESOURCES_MONITORING_HOSTNAME: GET /resources/monitoring/:hostname */
  getMonitoring: (hostname: string) =>
    api.get<MonitoringResponse>(`/resources/monitoring/${hostname}`).then((res) => res.data),

  /** 원본 GET_RESOURCES_MONITORING_LATEST: GET /resources/monitoring/latest */
  getLatestMonitoring: () =>
    api.get<MonitoringLatestResponse>('/resources/monitoring/latest').then((res) => res.data),
}
