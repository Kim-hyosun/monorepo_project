import { create } from 'zustand'

import type { AuthUserProfile } from '@/features/auth/types/auth'

const TOKEN_KEY = 'jwt'

interface AuthState {
  user: AuthUserProfile | null
  token: string | null
  setAuth: (token: string, user: AuthUserProfile) => void
  setUser: (user: AuthUserProfile | null) => void
  logout: () => void
}

function readInitialToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: readInitialToken(),
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(TOKEN_KEY, token)
    }
    set({ token, user })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(TOKEN_KEY)
    }
    set({ user: null, token: null })
  },
}))

// 훅 컨텍스트 밖(axios interceptor 등)에서 사용
export function getAuthToken(): string | null {
  return useAuthStore.getState().token
}

export function clearAuthToken(): void {
  useAuthStore.getState().logout()
}
