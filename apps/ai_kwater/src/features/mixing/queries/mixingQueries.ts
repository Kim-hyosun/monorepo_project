import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { mixingApi } from '@/features/mixing/api/mixingApi'
import type { PutMtccPayload, PutOperationPayload } from '@/features/mixing/types/mixing'

export const mixingKeys = {
  all: ['mixing'] as const,
  latest: () => [...mixingKeys.all, 'latest'] as const,
}

export function useMixingLatestQuery() {
  return useQuery({
    queryKey: mixingKeys.latest(),
    queryFn: async () => (await mixingApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}

export function useUpdateMixingOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => mixingApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: mixingKeys.latest() }),
  })
}

export function useUpdateMixingMtcc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutMtccPayload) => mixingApi.putMtcc(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: mixingKeys.latest() }),
  })
}
