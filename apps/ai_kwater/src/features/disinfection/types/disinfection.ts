// 원본: 성남정수장/src/store/aio/modules/disinfection/index.js. 전염소/중염소/후염소 (stage 1/2/3).

export interface DisinfectionStage {
  /** 잔류 염소 농도 */
  cl_residual: number | null
  /** AI 잔류 염소 예측 */
  ai_cl_residual: number | null
  /** 염소 주입율 */
  cl_dose: number | null
  /** AI 추천 주입율 */
  ai_cl_dose: number | null
}

export interface DisinfectionLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** stage 1 = 전염소, 2 = 중염소, 3 = 후염소 */
  stages: {
    pre: DisinfectionStage
    mid: DisinfectionStage
    after: DisinfectionStage
  }
  /** 4단계 분기 */
  stages_sc: {
    pre: DisinfectionStage
    mid: DisinfectionStage
    after: DisinfectionStage
  }
  /** 추천 주입율 트렌드 (후염소 기준) */
  ai_cl_dose_trend: Array<[number, number]> | null
  [key: string]: unknown
}

export interface DisinfectionLatestResponse {
  latest: DisinfectionLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}

export interface PutClDosePayload {
  stage: 'pre' | 'mid' | 'after'
  cl_dose: number
}
