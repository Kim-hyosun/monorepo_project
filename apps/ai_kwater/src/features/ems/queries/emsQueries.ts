import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { emsApi } from '@/features/ems/api/emsApi'
import type {
  AiOperationConfig,
  CostSetting,
  EmsTag,
  GoalConfig,
  PeakSetting,
  PumpPerformGranularity,
} from '@/features/ems/types/ems'

export const emsKeys = {
  all: ['ems'] as const,
  latest: () => [...emsKeys.all, 'latest'] as const,
  costs: () => [...emsKeys.all, 'costs'] as const,
  costSetting: () => [...emsKeys.all, 'cost-setting'] as const,
  goal: () => [...emsKeys.all, 'goal'] as const,
  peakSetting: () => [...emsKeys.all, 'peak-setting'] as const,
  tags: () => [...emsKeys.all, 'tags'] as const,
  report: (from: string, to: string) => [...emsKeys.all, 'report', from, to] as const,
  factor: () => [...emsKeys.all, 'factor'] as const,
  zones: () => [...emsKeys.all, 'zones'] as const,
  reservoirs: () => [...emsKeys.all, 'reservoirs'] as const,
  drParticipation: () => [...emsKeys.all, 'dr-participation'] as const,
  analysis: () => [...emsKeys.all, 'analysis'] as const,
  songsu: () => [...emsKeys.all, 'songsu'] as const,
  pumpPerform: (granularity: PumpPerformGranularity, from: string, to: string) =>
    [...emsKeys.all, 'pump-perform', granularity, from, to] as const,
  sujiSelect: (granularity: PumpPerformGranularity, from: string, to: string) =>
    [...emsKeys.all, 'suji-select', granularity, from, to] as const,
  sujiSelect2: (reservoir: string) => [...emsKeys.all, 'suji-select2', reservoir] as const,
  zoneUsage: (granularity: PumpPerformGranularity, from: string, to: string) =>
    [...emsKeys.all, 'zone-usage', granularity, from, to] as const,
  facUsage: (
    granularity: PumpPerformGranularity,
    facility: number,
    from: string,
    to: string,
  ) => [...emsKeys.all, 'fac-usage', granularity, facility, from, to] as const,
  useTrend: (granularity: PumpPerformGranularity, from: string, to: string) =>
    [...emsKeys.all, 'use-trend', granularity, from, to] as const,
}

export function useEmsLatestQuery() {
  return useQuery({
    queryKey: emsKeys.latest(),
    queryFn: async () => (await emsApi.getLatest()).latest,
    refetchInterval: 60_000,
  })
}

export function useEmsCostsQuery() {
  return useQuery({
    queryKey: emsKeys.costs(),
    queryFn: async () => (await emsApi.listCosts()).items,
  })
}

export function useEmsCostSettingQuery() {
  return useQuery({
    queryKey: emsKeys.costSetting(),
    queryFn: async () => (await emsApi.getCostSetting()).setting,
  })
}

export function useEmsGoalQuery() {
  return useQuery({
    queryKey: emsKeys.goal(),
    queryFn: async () => (await emsApi.getGoal()).goal,
  })
}

export function useEmsPeakSettingQuery() {
  return useQuery({
    queryKey: emsKeys.peakSetting(),
    queryFn: async () => (await emsApi.getPeakSetting()).peak,
  })
}

export function useEmsTagsQuery() {
  return useQuery({
    queryKey: emsKeys.tags(),
    queryFn: async () => (await emsApi.listTags()).tags,
  })
}

export function useEmsReportQuery(from: string, to: string, enabled = true) {
  return useQuery({
    queryKey: emsKeys.report(from, to),
    queryFn: async () => (await emsApi.getReport(from, to)).rows,
    enabled: enabled && !!from && !!to,
  })
}

export function useUpdateEmsCostSetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (setting: CostSetting) => emsApi.updateCostSetting(setting),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.costSetting() }),
  })
}

export function useUpdateEmsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (goal: GoalConfig) => emsApi.updateGoal(goal),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.goal() }),
  })
}

export function useUpdateEmsPeakSetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (peak: PeakSetting) => emsApi.updatePeakSetting(peak),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.peakSetting() }),
  })
}

export function useUpdateEmsTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<EmsTag> }) =>
      emsApi.updateTag(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.tags() }),
  })
}

export function useEmsFactorQuery() {
  return useQuery({
    queryKey: emsKeys.factor(),
    queryFn: async () => (await emsApi.getFactor()).factor,
    refetchInterval: 60_000,
  })
}

export function useEmsZonesQuery() {
  return useQuery({
    queryKey: emsKeys.zones(),
    queryFn: async () => (await emsApi.listZones()).zones,
    refetchInterval: 60_000,
  })
}

export function useEmsReservoirsQuery() {
  return useQuery({
    queryKey: emsKeys.reservoirs(),
    queryFn: async () => (await emsApi.listReservoirs()).reservoirs,
    refetchInterval: 60_000,
  })
}

export function useEmsDrParticipationQuery() {
  return useQuery({
    queryKey: emsKeys.drParticipation(),
    queryFn: async () => (await emsApi.getDrParticipation()).dr,
    refetchInterval: 60_000,
  })
}

export function useEmsAnalysisQuery() {
  return useQuery({
    queryKey: emsKeys.analysis(),
    queryFn: async () => (await emsApi.getAnalysis()).analysis,
    refetchInterval: 60_000,
  })
}

export function useEmsSongsuQuery() {
  return useQuery({
    queryKey: emsKeys.songsu(),
    queryFn: async () => (await emsApi.getSongsu()).songsu,
    refetchInterval: 60_000,
  })
}

export function useUpdateSongsuAiOperation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      station,
      config,
    }: {
      station: 'pyeongtaek' | 'songsan'
      config: AiOperationConfig
    }) => emsApi.updateSongsuAiOperation(station, config),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.songsu() }),
  })
}

export function useEmsPumpPerformQuery(
  granularity: PumpPerformGranularity,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: emsKeys.pumpPerform(granularity, from, to),
    queryFn: async () =>
      (await emsApi.getPumpPerform(granularity, from || undefined, to || undefined)).perform,
  })
}

export function useEmsSujiSelectQuery(
  granularity: PumpPerformGranularity,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: emsKeys.sujiSelect(granularity, from, to),
    queryFn: async () =>
      (await emsApi.getSujiSelect(granularity, from || undefined, to || undefined)).suji,
  })
}

export function useEmsSujiSelect2Query(reservoir: string) {
  return useQuery({
    queryKey: emsKeys.sujiSelect2(reservoir),
    queryFn: async () =>
      (await emsApi.getSujiSelect2(reservoir || undefined)).suji2,
  })
}

export function useEmsZoneUsageQuery(
  granularity: PumpPerformGranularity,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: emsKeys.zoneUsage(granularity, from, to),
    queryFn: async () =>
      (await emsApi.getZoneUsage(granularity, from || undefined, to || undefined)).zoneUsage,
  })
}

export function useEmsFacUsageQuery(
  granularity: PumpPerformGranularity,
  facility: number,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: emsKeys.facUsage(granularity, facility, from, to),
    queryFn: async () =>
      (
        await emsApi.getFacUsage(
          granularity,
          facility,
          from || undefined,
          to || undefined,
        )
      ).facUsage,
  })
}

export function useEmsUseTrendQuery(
  granularity: PumpPerformGranularity,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: emsKeys.useTrend(granularity, from, to),
    queryFn: async () =>
      (await emsApi.getUseTrend(granularity, from || undefined, to || undefined)).useTrend,
  })
}

export function useUpdateEmsOperationMode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ channel, mode }: { channel: 'h1' | 'h2'; mode: 0 | 1 | 2 }) =>
      emsApi.updateOperationMode(channel, mode),
    onSuccess: () => qc.invalidateQueries({ queryKey: emsKeys.latest() }),
  })
}
