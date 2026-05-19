// 원본: 성남정수장/src/store/aio/modules/ozone/index.js.

export interface OzoneLatest {
  update_time: string | null
  operation_mode: 0 | 1 | 2 | null
  /** 오존 농도 */
  oz_density: number | null
  /** 오존 주입율 */
  oz_dose: number | null
  /** AI 오존 주입률 */
  ai_oz_dose: number | null
  /** 오존 후 잔류 오존 */
  oz_residual: number | null
  /** 처리량 */
  oz_flow: number | null
  [key: string]: number | string | null
}

export interface OzoneLatestResponse {
  latest: OzoneLatest
}

export interface PutOperationPayload {
  operation_mode: 0 | 1 | 2
}
