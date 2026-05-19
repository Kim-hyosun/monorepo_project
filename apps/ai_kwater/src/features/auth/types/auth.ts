// 원본: 성남정수장/src/store/aio/modules/login.js 응답/페이로드.

export interface LoginCredentials {
  userid: string
  password: string
}

/** POST /login 응답. 원본 키 그대로. */
export interface LoginResponse {
  access_token: string
  expiration: string
  authority: number
  userid?: string
  partname?: string
  name?: string
}

/** GET /users/:userid 응답. (login flow 에서 사용자 정보 보강 시) */
export interface AuthUserResponse {
  users: {
    userid: string
    name: string
    partname: string
    authority: number
  }
}

export interface AuthUserProfile {
  userid: string
  name: string
  partname: string
  authority: number
  accessToken: string | null
  expiration: string | null
}
