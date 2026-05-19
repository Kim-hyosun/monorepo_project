// 원본: 성남정수장/src/store/aio/modules/raw/index.js (48줄). 원수 정보만.

export interface RawLatest {
  update_time: string | null
  /** 원수 탁도 */
  r_in_tb: number | null
  /** 원수 알칼리도 */
  r_in_al: number | null
  /** 원수 pH */
  r_in_ph: number | null
  /** 원수 수온 */
  r_in_te: number | null
  /** 기타 필드 */
  [key: string]: number | string | null
}

export interface RawLatestResponse {
  latest: RawLatest
}
