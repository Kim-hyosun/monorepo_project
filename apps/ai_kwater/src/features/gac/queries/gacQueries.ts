import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { gacApi } from '@/features/gac/api/gacApi'
import type { PutBackwashPayload, PutOperationPayload } from '@/features/gac/types/gac'

export const gacKeys = {
  all: ['gac'] as const,
  latest: () => [...gacKeys.all, 'latest'] as const,
}

export function useGacLatestQuery() {
  return useQuery({
    queryKey: gacKeys.latest(),
    queryFn: async () => (await gacApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}

export function useUpdateGacOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => gacApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: gacKeys.latest() }),
  })
}

export function useUpdateGacBackwash() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutBackwashPayload) => gacApi.putBackwash(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: gacKeys.latest() }),
  })
}
