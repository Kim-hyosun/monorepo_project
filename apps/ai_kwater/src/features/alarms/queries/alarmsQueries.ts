import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { alarmsApi } from '@/features/alarms/api/alarmsApi'
import type {
  AlarmControlPayload,
  AlarmSearchPayload,
  UpdateAlarmSettingPayload,
} from '@/features/alarms/types/alarm'

export const alarmKeys = {
  all: ['alarms'] as const,
  settings: () => [...alarmKeys.all, 'settings'] as const,
  history: (range: { start_time: number; end_time: number }) =>
    [...alarmKeys.all, 'history', range] as const,
  notify: () => [...alarmKeys.all, 'notify'] as const,
  info: () => [...alarmKeys.all, 'info'] as const,
}

export function useAlarmSettingsQuery() {
  return useQuery({
    queryKey: alarmKeys.settings(),
    queryFn: async () => {
      const res = await alarmsApi.getSettings()
      return res.alarm_info
    },
  })
}

export function useUpdateAlarmSetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      alarmInfoIndex,
      payload,
    }: {
      alarmInfoIndex: number
      payload: UpdateAlarmSettingPayload
    }) => alarmsApi.updateSetting(alarmInfoIndex, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: alarmKeys.settings() }),
  })
}

export function useAlarmHistoryMutation() {
  return useMutation({
    mutationFn: (payload: AlarmSearchPayload) => alarmsApi.searchHistory(payload),
  })
}

export function useAlarmNotifyQuery(options: { enabled?: boolean; refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: alarmKeys.notify(),
    queryFn: () => alarmsApi.getNotify(),
    enabled: options.enabled,
    refetchInterval: options.refetchInterval,
  })
}

export function useAlarmInfoV2Query() {
  return useQuery({
    queryKey: alarmKeys.info(),
    queryFn: async () => {
      const res = await alarmsApi.getInfo()
      return res.alarm_info
    },
  })
}

export function useAlarmControlMutation() {
  return useMutation({
    mutationFn: (payload: AlarmControlPayload) => alarmsApi.putControl(payload),
  })
}
