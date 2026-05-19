import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/features/users/api/userApi'
import type {
  CreateUserPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
  User,
} from '@/features/users/types/user'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
}

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const res = await userApi.list()
      // admin 계정은 list에서 제외 (원본 동작 유지)
      return res.login.filter((u: User) => u.userid !== 'admin')
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userid, payload }: { userid: string; payload: UpdateUserPayload }) =>
      userApi.update(userid, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ userid, payload }: { userid: string; payload: ResetPasswordPayload }) =>
      userApi.resetPassword(userid, payload),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userid: string) => userApi.remove(userid),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}
