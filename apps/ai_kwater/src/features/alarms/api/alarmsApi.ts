// 원본: 성남정수장/src/store/aio/modules/alarm/alarm.js → axios 함수형.

import { api } from '@/libs/axios/instance'
import type {
  AlarmControlPayload,
  AlarmInfoResponse,
  AlarmInfoV2Response,
  AlarmNotifyResponse,
  AlarmSearchPayload,
  AlarmSearchResponse,
  UpdateAlarmSettingPayload,
} from '@/features/alarms/types/alarm'

export const alarmsApi = {
  /** 원본 GET_ALL_ALARM_SETTING: GET /alarms/setting */
  getSettings: () => api.get<AlarmInfoResponse>('/alarms/setting').then((res) => res.data),

  /** 원본 PUT_ALARM: PUT /alarms/setting/:index */
  updateSetting: (alarmInfoIndex: number, payload: UpdateAlarmSettingPayload) =>
    api.put<void>(`/alarms/setting/${alarmInfoIndex}`, payload).then((res) => res.data),

  /** 원본 PUT_ALARMS_SEARCH: PUT /alarms/search */
  searchHistory: (payload: AlarmSearchPayload) =>
    api
      .put<AlarmSearchResponse>('/alarms/search', {
        start_time: payload.start_time,
        end_time: payload.end_time,
      })
      .then((res) => res.data),

  /** 원본 GET_ALARM_NOTIFY: GET /alarm/notify */
  getNotify: () => api.get<AlarmNotifyResponse>('/alarm/notify').then((res) => res.data),

  /** 원본 GET_ALARM_INFO: GET /alarm/info */
  getInfo: () => api.get<AlarmInfoV2Response>('/alarm/info').then((res) => res.data),

  /** 원본 PUT_ALARM_CONTROL: PUT /alarm/control */
  putControl: (payload: AlarmControlPayload) =>
    api.put<void>('/alarm/control', payload).then((res) => res.data),
}
