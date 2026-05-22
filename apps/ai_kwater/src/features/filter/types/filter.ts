// 원본: 성남정수장/src/store/aio/modules/filter/index.js. 여과지.

export interface FilterScheduleEntry {
  /** 여과지 번호 */
  filter_no: number
  /** 시작 시각 */
  start: string | null
  /** 종료 시각 */
  end: string | null
  /** 다음 종료 시각 */
  next_end: string | null
}

export interface FilterLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** 여과 손실 수두 */
  f_loss_head: number | null
  f_loss_head_sc: number | null
  /** AI 손실 수두 예측 */
  ai_f_loss_head: number | null
  ai_f_loss_head_sc: number | null
  /** 역세 주기 */
  bw_interval: number | null
  /** AI 역세 추천 주기 */
  ai_bw_interval: number | null
  /** 출구 탁도 */
  f_out_tb: number | null
  /** 운영중 여과지 수 */
  f_running_count: number | null
  /** 운영 일정 */
  schedule: FilterScheduleEntry[] | null
  /** 손실 수두 트렌드 */
  ai_f_loss_head_trend: Array<[number, number]> | null
  /** 여과지 6기 ON/OFF */
  f_states: boolean[] | null
  /** 여과지 수위 (m) 시계열 */
  f_water_level_trend: Array<[number, number]> | null
  /** AI 추천 역세 구간 — xAxis plotBand */
  ai_recommend_bands: Array<{ from: number; to: number; label?: string }> | null
  [key: string]:
    | number
    | string
    | boolean[]
    | Array<[number, number]>
    | Array<{ from: number; to: number; label?: string }>
    | FilterScheduleEntry[]
    | null
}

export interface FilterLatestResponse {
  latest: FilterLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutBackwashPayload {
  bw_interval: number
}
