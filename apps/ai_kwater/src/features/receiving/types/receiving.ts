// 원본: 성남정수장/src/store/aio/modules/receiving/index.js. 주요 필드만 명시, 나머지는 generic.

export interface ReceivingLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  ems_mode: number | null
  /** 정수지 최대 목표 수위 */
  h_target_le_max: number | string | null
  /** 정수지 최소 목표 수위 */
  h_target_le_min: number | string | null
  /** 원수 유입 유량 (3단계) */
  b_in_fr_i: number | null
  /** 원수 유입 유량 (4단계) */
  b_in_fr_i_sc: number | null
  /** 1차 원수 조절 밸브 (3) */
  b1_vv_po: number | null
  /** 1차 원수 조절 밸브 (4) */
  b1_vv_po_sc: number | null
  /** 정수지#1 수위 (3) */
  h_location_le1: number | null
  /** 정수지#1 수위 (4) */
  h_location_le1_sc: number | null
  /** AI 정수지 유입유량 예측 */
  ai_b1_in_fr: number | null
  /** 원수 유입유량 트렌드 시계열 */
  ai_b_in_fr_trend: Array<[number, number]> | null
  [key: string]: number | string | Array<[number, number]> | null
}

export interface ReceivingLatestResponse {
  latest: ReceivingLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutLevelPayload {
  h_target_le_max: number
  h_target_le_min: number
}
