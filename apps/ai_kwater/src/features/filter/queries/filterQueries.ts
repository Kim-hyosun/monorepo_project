import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { filterApi } from '@/features/filter/api/filterApi'
import type {
  PutBackwashPayload,
  PutOperationPayload,
} from '@/features/filter/types/filter'

export const filterKeys = {
  all: ['filter'] as const,
  latest: () => [...filterKeys.all, 'latest'] as const,
}

export function useFilterLatestQuery() {
  return useQuery({
    queryKey: filterKeys.latest(),
    queryFn: async () => (await filterApi.getLatest()).latest,
    refetchInterval: 60_000,
  })
}

export function useUpdateFilterOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => filterApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: filterKeys.latest() }),
  })
}

export function useUpdateFilterBackwash() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutBackwashPayload) => filterApi.putBackwash(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: filterKeys.latest() }),
  })
}
