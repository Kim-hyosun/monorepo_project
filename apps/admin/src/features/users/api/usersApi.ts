import { api } from '@/libs/axios/instance'
import type { CreateUserInput, User } from '../types/user.schema'

export const usersApi = {
  list: () => api.get<User[]>('/users').then((r) => r.data),
  detail: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
  create: (input: CreateUserInput) => api.post<User>('/users', input).then((r) => r.data),
}
