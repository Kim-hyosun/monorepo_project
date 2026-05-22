// 원본: 성남정수장/src/store/aio/modules/gac/index.js. GAC 여과.

export interface GacLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** GAC 출구 탁도 */
  g_out_tb: number | null
  /** AI 출구 탁도 예측 */
  ai_g_out_tb: number | null
  /** GAC 손실 수두 */
  g_loss_head: number | null
  /** AI 손실 수두 예측 */
  ai_g_loss_head: number | null
  /** 역세 주기 */
  bw_interval: number | null
  /** AI 역세 추천 주기 */
  ai_bw_interval: number | null
  /** 운영중 GAC 수 */
  g_running_count: number | null
  /** 손실 수두 트렌드 */
  ai_g_loss_head_trend: Array<[number, number]> | null
  /** GAC 4기 ON/OFF */
  gac_states: boolean[] | null
  [key: string]: number | string | boolean[] | Array<[number, number]> | null
}

export interface GacLatestResponse {
  latest: GacLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutBackwashPayload {
  bw_interval: number
}
