import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { networkApi } from '@/features/network/api/networkApi'
import type { NetworkConfig } from '@/features/network/types/network'

export const networkKeys = {
  all: ['network'] as const,
  config: () => [...networkKeys.all, 'config'] as const,
}

export function useNetworkConfigQuery() {
  return useQuery({
    queryKey: networkKeys.config(),
    queryFn: async () => {
      const res = await networkApi.get()
      return res.config
    },
  })
}

export function useUpdateNetworkConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: NetworkConfig) => networkApi.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: networkKeys.config() }),
  })
}
