// 원본: 성남정수장/src/store/aio/modules/coagulants/index.js.

export interface CoagulantsLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** 응집제 주입율 */
  cg_dose: number | null
  /** 응집제 주입율(4단계) */
  cg_dose_sc: number | null
  /** AI 응집제 주입율 */
  ai_cg_dose: number | null
  /** AI 응집제 주입율(4단계) */
  ai_cg_dose_sc: number | null
  /** 응집제 농도 */
  cg_density: number | null
  /** 정수지 유입 탁도 */
  in_tb: number | null
  /** AI 응집제 주입율 추천 */
  recommend_cg_dose: number | null
  /** AI 응집제 주입율 시계열 */
  ai_cg_dose_trend: Array<[number, number]> | null
  [key: string]: number | string | Array<[number, number]> | null
}

export interface CoagulantsLatestResponse {
  latest: CoagulantsLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutCgDosagePayload {
  cg_dose: number
}

export interface CgSimulationInput {
  turbidity: number
  alkalinity: number
  ph: number
}

export interface CgSimulationResult {
  recommended_dose: number
  expected_residual_turbidity: number
  expected_ph: number
}
