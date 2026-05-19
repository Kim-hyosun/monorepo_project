import { http, HttpResponse } from 'msw'

import {
  seedAlarmHistory,
  seedAlarmInfo,
  seedAlarmInfoV2,
  seedAlarmNotify,
} from '@/mocks/data/alarms'
import type { UpdateAlarmSettingPayload } from '@/features/alarms/types/alarm'

let alarmInfo = [...seedAlarmInfo]

export const alarmHandlers = [
  http.get('*/alarms/setting', () => {
    return HttpResponse.json({ alarm_info: alarmInfo })
  }),

  http.put('*/alarms/setting/:index', async ({ params, request }) => {
    const idx = Number(params.index)
    const payload = (await request.json()) as UpdateAlarmSettingPayload
    alarmInfo = alarmInfo.map((a) =>
      a.alarm_info_index === idx
        ? { ...a, display_name: payload.display_name, value: payload.value, scada_send: payload.scada_send }
        : a,
    )
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/alarms/search', () => {
    return HttpResponse.json({ alarms: seedAlarmHistory })
  }),

  http.get('*/alarm/notify', () => {
    return HttpResponse.json({ alarm: seedAlarmNotify })
  }),

  http.get('*/alarm/info', () => {
    return HttpResponse.json({ alarm_info: seedAlarmInfoV2 })
  }),

  http.put('*/alarm/control', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
