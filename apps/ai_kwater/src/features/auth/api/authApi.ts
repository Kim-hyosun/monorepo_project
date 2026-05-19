// 원본: 성남정수장/src/store/aio/modules/login.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type {
  AuthUserResponse,
  LoginCredentials,
  LoginResponse,
} from '@/features/auth/types/auth'

export const authApi = {
  /** 로그인 (POST /login) — 원본 LOGIN_POST */
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/login', credentials).then((res) => res.data),

  /** 세션 연장 (PUT /login) — 원본 LOGIN_PUT, 30분 만료 갱신 */
  extend: () => api.put<LoginResponse>('/login').then((res) => res.data),

  /** 로그아웃 (DELETE /logout) — 원본 LOGOUT */
  logout: () => api.delete<void>('/logout').then((res) => res.data),

  /** 로그인 직후 본인 정보 조회 (GET /users/:userid) — 원본 LOGIN_POST 의 후속 호출 */
  getMe: (userid: string) =>
    api.get<AuthUserResponse>(`/users/${userid}`).then((res) => res.data),
}
