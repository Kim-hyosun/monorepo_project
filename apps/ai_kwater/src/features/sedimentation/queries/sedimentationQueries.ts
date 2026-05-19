import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { sedimentationApi } from '@/features/sedimentation/api/sedimentationApi'
import type {
  PutOperationPayload,
  PutSettingsPayload,
} from '@/features/sedimentation/types/sedimentation'

export const sedimentationKeys = {
  all: ['sedimentation'] as const,
  latest: () => [...sedimentationKeys.all, 'latest'] as const,
}

export function useSedimentationLatestQuery() {
  return useQuery({
    queryKey: sedimentationKeys.latest(),
    queryFn: async () => (await sedimentationApi.getLatest()).latest,
    refetchInterval: 60_000,
  })
}

export function useUpdateSedimentationOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => sedimentationApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sedimentationKeys.latest() }),
  })
}

export function useUpdateSedimentationSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutSettingsPayload) => sedimentationApi.putSettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sedimentationKeys.latest() }),
  })
}
