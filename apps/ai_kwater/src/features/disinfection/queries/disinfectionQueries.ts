import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { disinfectionApi } from '@/features/disinfection/api/disinfectionApi'
import type {
  PutClDosePayload,
  PutOperationPayload,
} from '@/features/disinfection/types/disinfection'

export const disinfectionKeys = {
  all: ['disinfection'] as const,
  latest: () => [...disinfectionKeys.all, 'latest'] as const,
}

export function useDisinfectionLatestQuery() {
  return useQuery({
    queryKey: disinfectionKeys.latest(),
    queryFn: async () => (await disinfectionApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}

export function useUpdateDisinfectionOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => disinfectionApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: disinfectionKeys.latest() }),
  })
}

export function useUpdateDisinfectionClDose() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutClDosePayload) => disinfectionApi.putClDose(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: disinfectionKeys.latest() }),
  })
}
