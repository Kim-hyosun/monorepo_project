import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { receivingApi } from '@/features/receiving/api/receivingApi'
import type { PutLevelPayload, PutOperationPayload } from '@/features/receiving/types/receiving'

export const receivingKeys = {
  all: ['receiving'] as const,
  latest: () => [...receivingKeys.all, 'latest'] as const,
}

export function useReceivingLatestQuery() {
  return useQuery({
    queryKey: receivingKeys.latest(),
    queryFn: async () => (await receivingApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}

export function useUpdateReceivingOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => receivingApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: receivingKeys.latest() }),
  })
}

export function useUpdateReceivingLevel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutLevelPayload) => receivingApi.putLevel(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: receivingKeys.latest() }),
  })
}
