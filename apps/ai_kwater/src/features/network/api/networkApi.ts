// 원본: 성남정수장/src/store/aio/modules/network.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type { NetworkConfig, NetworkConfigResponse } from '@/features/network/types/network'

export const networkApi = {
  /** 원본 GET_NETWORK_CONFIG: GET /config */
  get: () => api.get<NetworkConfigResponse>('/config').then((res) => res.data),

  /** 원본 PUT_NETWORK_CONFIG: PUT /config */
  update: (payload: NetworkConfig) =>
    api.put<NetworkConfigResponse>('/config', payload).then((res) => res.data),
}
