// 원본: 성남정수장/src/store/aio/modules/loginHistory.js GET /login 응답.

export interface LoginHistoryEntry {
  login_history_index: number
  userid: string
  partname: string
  name: string
  login_time: string
  logout_time: string | null
  ip: string
  /** 원본 LoginHistory.vue 의 type 필드. 1 = 로그인, 0 = 로그아웃 */
  type: 0 | 1
  /** 원본 시간/주소 컬럼 키 (LoginHistory.vue 는 history_index/timestamp/address 도 함께 사용했음) */
  timestamp?: string
  address?: string
}

/** 원본 응답 키 그대로 (mutations 의 data.login). */
export interface LoginHistoryResponse {
  login: LoginHistoryEntry[]
}
