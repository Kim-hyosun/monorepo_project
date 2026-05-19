// 원본: 성남정수장/src/store/aio/modules/clear/index.js → axios 함수형.
// 실제 페이지 호출 / queries / mock 은 Phase D 에서 추가.

import { api } from '@/libs/axios/instance'
import type {
  ClearHistoryClResponse,
  ClearHistoryFlowOutResponse,
  ClearHistoryLevelResponse,
  ClearHistoryRangePayload,
} from '@/features/clear/types/clear'

export const clearApi = {
  /** 원본 PUT_CLEAR_HISTORY_FLOW_OUT: PUT /clear/history/fr/out */
  historyFlowOut: (payload: ClearHistoryRangePayload) =>
    api.put<ClearHistoryFlowOutResponse>('/clear/history/fr/out', payload).then((res) => res.data),

  /** 원본 PUT_CLEAR_HISTORY_LEVEL: PUT /clear/history/le */
  historyLevel: (payload: ClearHistoryRangePayload) =>
    api.put<ClearHistoryLevelResponse>('/clear/history/le', payload).then((res) => res.data),

  /** 원본 PUT_CLEAR_HISTORY_CL: POST /disinfection/history/corrected/post/:stage */
  historyCl: (stage: number, payload: ClearHistoryRangePayload) =>
    api
      .post<ClearHistoryClResponse>(`/disinfection/history/corrected/post/${stage}`, payload)
      .then((res) => res.data),
}
