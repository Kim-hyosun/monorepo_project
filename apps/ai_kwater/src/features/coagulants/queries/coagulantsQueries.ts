import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { coagulantsApi } from '@/features/coagulants/api/coagulantsApi'
import type {
  CgSimulationInput,
  PutCgDosagePayload,
  PutOperationPayload,
} from '@/features/coagulants/types/coagulants'

export const coagulantsKeys = {
  all: ['coagulants'] as const,
  latest: () => [...coagulantsKeys.all, 'latest'] as const,
}

export function useCoagulantsLatestQuery() {
  return useQuery({
    queryKey: coagulantsKeys.latest(),
    queryFn: async () => (await coagulantsApi.getLatest()).latest,
    refetchInterval: 120_000,
  })
}

export function useUpdateCoagulantsOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => coagulantsApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: coagulantsKeys.latest() }),
  })
}

export function useUpdateCoagulantsDosage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutCgDosagePayload) => coagulantsApi.putDosage(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: coagulantsKeys.latest() }),
  })
}

export function useCgSimulate() {
  return useMutation({
    mutationFn: (payload: CgSimulationInput) => coagulantsApi.simulate(payload),
  })
}
