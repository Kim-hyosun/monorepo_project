// 원본: 성남정수장/src/store/aio/modules/sedimentation/index.js.

export interface SedimentationLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** 침전지 출구 탁도 */
  e_out_tb: number | null
  e_out_tb_sc: number | null
  /** AI 침전지 출구 탁도 예측 */
  ai_e_out_tb: number | null
  ai_e_out_tb_sc: number | null
  /** 침전 시간 */
  sd_time: number | null
  /** 슬러지 농도 */
  sd_density: number | null
  /** 슬러지 배출 주기 */
  sd_purge_interval: number | null
  /** AI 슬러지 배출 추천 주기 */
  ai_sd_purge_interval: number | null
  /** 침전지 출구 탁도 트렌드 */
  ai_e_out_tb_trend: Array<[number, number]> | null
  [key: string]: number | string | Array<[number, number]> | null
}

export interface SedimentationLatestResponse {
  latest: SedimentationLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutSettingsPayload {
  sd_time: number
  sd_purge_interval: number
}
