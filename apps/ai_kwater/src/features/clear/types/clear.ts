// 원본: 성남정수장/src/store/aio/modules/clear/index.js — 정수지 history.

export interface ClearHistoryFlowOutResponse {
  out_fr: Array<{ time: string; value: number }>
}

export interface ClearHistoryLevelResponse {
  le: Array<{ time: string; value: number }>
}

/** disinfection/history/corrected POST 응답. 정수지 잔류염소 in/out 트렌드. */
export interface ClearHistoryClResponse {
  corrected: {
    in: Array<{ time: string; value: number }>
    out: Array<{ time: string; value: number }>
  }
}

export interface ClearHistoryRangePayload {
  start_time: string
  end_time: string
}
