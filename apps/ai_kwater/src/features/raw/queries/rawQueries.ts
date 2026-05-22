import { useQuery } from '@tanstack/react-query'

import { rawApi } from '@/features/raw/api/rawApi'

export const rawKeys = {
  all: ['raw'] as const,
  latest: () => [...rawKeys.all, 'latest'] as const,
}

export function useRawLatestQuery() {
  return useQuery({
    queryKey: rawKeys.latest(),
    queryFn: async () => (await rawApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}
