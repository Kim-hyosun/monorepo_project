import { api } from '@/libs/axios/instance'
import type { LoginInput } from '../types/login.schema'

interface LoginResponse {
  user: { id: string; email: string }
  accessToken: string
}

export const authApi = {
  login: (input: LoginInput) =>
    api.post<LoginResponse>('/auth/login', input).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
}
