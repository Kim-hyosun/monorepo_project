import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { dialog } from '@/libs/dialog'
import { getAuthToken, clearAuthToken } from '@/stores/authStore'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  withCredentials: true,
  timeout: 10_000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken()
  if (token) {
    config.headers.set('Authorization', token)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      clearAuthToken()
      await dialog.alert({ title: '인증 만료', description: '다시 로그인해주세요.' })
    } else if (typeof window !== 'undefined') {
      // 글로벌 에러 알림. 호출부에서 별도 처리(예: 409)는 catch에서 가로채면 됨.
      const skip = error.config?.headers?.['x-skip-global-error']
      if (!skip) {
        await dialog.alert({ title: '오류', description: '오류가 발생했습니다.' })
      }
    }
    return Promise.reject(error)
  }
)
