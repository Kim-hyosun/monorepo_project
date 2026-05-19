import { api } from '@/libs/axios/instance'
import type {
  CreateUserPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
  UsersResponse,
} from '@/features/users/types/user'

export const userApi = {
  list: () => api.get<UsersResponse>('/users').then((res) => res.data),
  create: (payload: CreateUserPayload) => api.post<void>('/users', payload).then((res) => res.data),
  update: (userid: string, payload: UpdateUserPayload) =>
    api.put<void>(`/users/${userid}`, payload).then((res) => res.data),
  resetPassword: (userid: string, payload: ResetPasswordPayload) =>
    api.put<void>(`/users/pw/${userid}`, payload).then((res) => res.data),
  remove: (userid: string) => api.delete<void>(`/users/${userid}`).then((res) => res.data),
}
