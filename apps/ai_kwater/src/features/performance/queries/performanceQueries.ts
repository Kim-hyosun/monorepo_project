import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { performanceApi } from '@/features/performance/api/performanceApi'
import type { UpdateResourceNamePayload } from '@/features/performance/types/performance'

export const performanceKeys = {
  all: ['performance'] as const,
  resources: () => [...performanceKeys.all, 'resources'] as const,
  monitoring: (hostname: string) => [...performanceKeys.all, 'monitoring', hostname] as const,
  latest: () => [...performanceKeys.all, 'latest'] as const,
}

export function useResourcesQuery() {
  return useQuery({
    queryKey: performanceKeys.resources(),
    queryFn: async () => {
      const res = await performanceApi.listResources()
      return res.resources
    },
  })
}

export function useMonitoringQuery(hostname: string | null) {
  return useQuery({
    queryKey: performanceKeys.monitoring(hostname ?? ''),
    queryFn: async () => {
      const res = await performanceApi.getMonitoring(hostname as string)
      return res.monitoring
    },
    enabled: !!hostname,
  })
}

export function useLatestMonitoringQuery(refetchInterval = 60_000) {
  return useQuery({
    queryKey: performanceKeys.latest(),
    queryFn: async () => {
      const res = await performanceApi.getLatestMonitoring()
      return res.monitoring
    },
    refetchInterval,
  })
}

export function useUpdateResourceName() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ hostname, payload }: { hostname: string; payload: UpdateResourceNamePayload }) =>
      performanceApi.updateResourceName(hostname, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: performanceKeys.resources() }),
  })
}
