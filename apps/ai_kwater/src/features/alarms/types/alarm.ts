// 원본: 성남정수장/src/store/aio/modules/alarm/alarm.js 응답/페이로드.

/** 알람 설정(관리자 전용 GET /alarms/setting). 원본 alarm_info 항목. */
export interface AlarmInfo {
  alarm_info_index: number
  alarm_id: string
  display_name: string
  value: number
  scada_send: number
  /** 원본 AlarmManagement.vue 의 type 필드. 0=ON/OFF, 1=Threshold, 2=Control, 3=AI */
  type: 0 | 1 | 2 | 3
}

export interface AlarmInfoResponse {
  alarm_info: AlarmInfo[]
}

/** 알람 이력 (PUT /alarms/search). 원본 alarms / alarms7Days 항목 — 응답 키 그대로. */
export interface AlarmHistoryEntry {
  alarm_id: string
  alarm_time: string
  display_name: string
  value: number
  ack_time: string | null
}

export interface AlarmSearchResponse {
  alarms: AlarmHistoryEntry[]
}

export interface AlarmSearchPayload {
  start_time: number
  end_time: number
  isInit?: boolean
}

/** notify v2 GET /alarm/notify 응답 항목. */
export interface AlarmNotifyEntry {
  alarm_notify_index: number
  alarm_id: string
  alarm_time: string
  display_name: string
}

export interface AlarmNotifyResponse {
  alarm: AlarmNotifyEntry[]
}

/** info v2 GET /alarm/info */
export interface AlarmInfoV2Entry {
  alarm_id: string
  display_name: string
  value: number
}

export interface AlarmInfoV2Response {
  alarm_info: AlarmInfoV2Entry[]
}

/** PUT /alarms/setting/:index */
export interface UpdateAlarmSettingPayload {
  display_name: string
  value: number
  scada_send: number
}

/** PUT /alarm/control */
export interface AlarmControlPayload {
  alarm_id: string
  alarm_time: string
}
