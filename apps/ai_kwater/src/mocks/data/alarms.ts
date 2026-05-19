import type {
  AlarmHistoryEntry,
  AlarmInfo,
  AlarmInfoV2Entry,
  AlarmNotifyEntry,
} from '@/features/alarms/types/alarm'

/**
 * alarm_id 첫 글자는 임의(A/B/…), 2번째 글자가 분류 (1=HW, 2=SW, 3=AI).
 * 원본 classifyByAlarmId 규칙에 맞춤.
 */
export const seedAlarmInfo: AlarmInfo[] = [
  { alarm_info_index: 1, alarm_id: 'A1_rw_turbidity_high', display_name: '원수 탁도 상한', value: 5, scada_send: 1, type: 1 },
  { alarm_info_index: 2, alarm_id: 'A1_rw_turbidity_low', display_name: '원수 탁도 하한', value: 0.1, scada_send: 1, type: 1 },
  { alarm_info_index: 3, alarm_id: 'A1_cg_dosage_high', display_name: '응집제 주입율 상한', value: 60, scada_send: 1, type: 1 },
  { alarm_info_index: 4, alarm_id: 'A1_ds_residual_low', display_name: '잔류염소 하한', value: 0.4, scada_send: 1, type: 1 },
  { alarm_info_index: 5, alarm_id: 'A1_clear_level_low', display_name: '정수지 수위 하한', value: 1.5, scada_send: 0, type: 1 },
  { alarm_info_index: 6, alarm_id: 'A2_db_disk_full', display_name: 'DB 디스크 가득 참', value: 90, scada_send: 0, type: 0 },
  { alarm_info_index: 7, alarm_id: 'A2_ingest_lag', display_name: '데이터 수집 지연', value: 30, scada_send: 0, type: 1 },
  { alarm_info_index: 8, alarm_id: 'A3_ai_pump_anomaly', display_name: 'AI 펌프 이상 감지', value: 0, scada_send: 1, type: 3 },
  { alarm_info_index: 9, alarm_id: 'A3_ai_coagulant_drift', display_name: 'AI 응집제 드리프트', value: 0, scada_send: 1, type: 3 },
]

export const seedAlarmInfoV2: AlarmInfoV2Entry[] = seedAlarmInfo.map(({ alarm_id, display_name, value }) => ({
  alarm_id,
  display_name,
  value,
}))

const baseTime = new Date('2026-05-17T08:00:00').getTime()
export const seedAlarmHistory: AlarmHistoryEntry[] = [
  { alarm_id: 'A1_rw_turbidity_high', alarm_time: new Date(baseTime).toISOString(), display_name: '원수 탁도 상한', value: 5.4, ack_time: null },
  { alarm_id: 'A1_cg_dosage_high', alarm_time: new Date(baseTime + 3600_000).toISOString(), display_name: '응집제 주입율 상한', value: 62.1, ack_time: new Date(baseTime + 4_000_000).toISOString() },
  { alarm_id: 'A1_ds_residual_low', alarm_time: new Date(baseTime + 7200_000).toISOString(), display_name: '잔류염소 하한', value: 0.32, ack_time: null },
]

export const seedAlarmNotify: AlarmNotifyEntry[] = [
  { alarm_notify_index: 1001, alarm_id: 'A1_rw_turbidity_high', alarm_time: new Date(baseTime).toISOString(), display_name: '원수 탁도 상한' },
]
