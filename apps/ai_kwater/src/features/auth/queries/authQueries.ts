import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/features/auth/types/auth'

/** 원본 LOGIN_POST: 로그인 → me 조회 → authStore 채움. */
export function useLoginMutation() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const login = await authApi.login(credentials)
      const me = await authApi.getMe(credentials.userid)
      return { login, me: me.users }
    },
    onSuccess: ({ login, me }) => {
      useAuthStore.getState().setAuth(login.access_token, {
        userid: me.userid,
        name: me.name,
        partname: me.partname,
        authority: me.authority,
        accessToken: login.access_token,
        expiration: login.expiration,
      })
    },
  })
}

/** 원본 LOGIN_PUT: 30분 만료 연장. */
export function useExtendLoginMutation() {
  return useMutation({
    mutationFn: () => authApi.extend(),
    onSuccess: (data) => {
      const cur = useAuthStore.getState().user
      if (!cur) return
      useAuthStore.getState().setAuth(data.access_token, {
        ...cur,
        accessToken: data.access_token,
        expiration: data.expiration,
      })
    },
    onError: () => {
      // 원본: 연장 실패시 LOGOUT commit
      useAuthStore.getState().logout()
    },
  })
}

/** 원본 LOGOUT. */
export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // 성공/실패 모두 클라이언트 상태는 비움 (원본 catch 도 LOGOUT commit)
      useAuthStore.getState().logout()
    },
  })
}
