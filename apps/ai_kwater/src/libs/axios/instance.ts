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

    // 네트워크 에러 / timeout / MSW 미준비 등 response 없는 경우는 글로벌 alert 안함
    // (TQ retry / refetchInterval 로 자동 복구)
    const isNetworkError = !error.response

    if (status === 401) {
      clearAuthToken()
      await dialog.alert({ title: '인증 만료', description: '다시 로그인해주세요.' })
    } else if (!isNetworkError && typeof window !== 'undefined') {
      // 서버가 응답한 4xx/5xx 만 글로벌 알림 (호출부에서 x-skip-global-error 헤더로 skip 가능)
      const skip = error.config?.headers?.['x-skip-global-error']
      if (!skip) {
        await dialog.alert({ title: '오류', description: '오류가 발생했습니다.' })
      }
    }
    return Promise.reject(error)
  },
)
