import { useQuery } from '@tanstack/react-query'

import { loginHistoryApi } from '@/features/loginHistory/api/loginHistoryApi'

export const loginHistoryKeys = {
  all: ['loginHistory'] as const,
  list: () => [...loginHistoryKeys.all, 'list'] as const,
}

export function useLoginHistoryQuery() {
  return useQuery({
    queryKey: loginHistoryKeys.list(),
    queryFn: async () => {
      const res = await loginHistoryApi.list()
      return res.login
    },
  })
}
