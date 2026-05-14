import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/stores/authStore'

export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user)
    },
  })
}
