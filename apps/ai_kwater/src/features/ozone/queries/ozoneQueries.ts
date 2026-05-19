import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ozoneApi } from '@/features/ozone/api/ozoneApi'
import type { PutOperationPayload } from '@/features/ozone/types/ozone'

export const ozoneKeys = {
  all: ['ozone'] as const,
  latest: () => [...ozoneKeys.all, 'latest'] as const,
}

export function useOzoneLatestQuery() {
  return useQuery({
    queryKey: ozoneKeys.latest(),
    queryFn: async () => (await ozoneApi.getLatest()).latest,
    refetchInterval: 60_000,
  })
}

export function useUpdateOzoneOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PutOperationPayload) => ozoneApi.putOperation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ozoneKeys.latest() }),
  })
}
