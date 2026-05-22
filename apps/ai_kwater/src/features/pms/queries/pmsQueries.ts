import { useQuery } from '@tanstack/react-query'

import { pmsApi } from '@/features/pms/api/pmsApi'

export const pmsKeys = {
  all: ['pms'] as const,
  motors: () => [...pmsKeys.all, 'motors'] as const,
  motor: (id: string) => [...pmsKeys.all, 'motor', id] as const,
  alerts: () => [...pmsKeys.all, 'alerts'] as const,
  process: () => [...pmsKeys.all, 'process'] as const,
}

export function usePmsMotorsQuery() {
  return useQuery({
    queryKey: pmsKeys.motors(),
    queryFn: async () => (await pmsApi.listMotors()).motors,
    refetchInterval: 60_000,
  })
}

export function usePmsMotorQuery(id: string | null) {
  return useQuery({
    queryKey: pmsKeys.motor(id ?? ''),
    queryFn: async () => (await pmsApi.getMotor(id as string)).motor,
    enabled: !!id,
    refetchInterval: 60_000,
  })
}

export function usePmsAlertsQuery() {
  return useQuery({
    queryKey: pmsKeys.alerts(),
    queryFn: async () => (await pmsApi.listAlerts()).alerts,
    refetchInterval: 60_000,
  })
}

export function usePmsProcessStatusQuery() {
  return useQuery({
    queryKey: pmsKeys.process(),
    queryFn: async () => (await pmsApi.getProcessStatus()).process,
    refetchInterval: 60_000,
  })
}
