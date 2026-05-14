import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: usersApi.list,
  })
}
