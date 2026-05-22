// 원본: 성남정수장/src/store/aio/modules/mixing/index.js. 혼화 / 응집지.

export interface MixingLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** 혼화 G값 (s⁻¹) — 3단계 */
  g_value: number | null
  /** 혼화 G값 — 4단계 */
  g_value_sc: number | null
  /** AI 혼화 G값 */
  ai_g_value: number | null
  ai_g_value_sc: number | null
  /** 응집 시간 */
  mtcc_time: number | null
  /** 혼화기 RPM */
  mixer_rpm: number | null
  /** AI 혼화기 RPM */
  ai_mixer_rpm: number | null
  /** G값 트렌드 */
  ai_g_value_trend: Array<[number, number]> | null
  /** G·t 값 */
  gt_value: number | null
  /** 혼화기 2기 RPM */
  mixer_rpms: number[] | null
  [key: string]: number | string | number[] | Array<[number, number]> | null
}

export interface MixingLatestResponse {
  latest: MixingLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutMtccPayload {
  g_value: number
  mtcc_time: number
}
