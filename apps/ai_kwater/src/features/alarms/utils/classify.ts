// 원본: AlarmManagement.vue 의 getSelectedItem 분류 로직 → 순수 함수.

import type { AlarmInfo } from '@/features/alarms/types/alarm'

export type AlarmClassification = 'HW' | 'SW' | 'AI'
export type AlarmTypeLabel = 'ON/OFF' | 'Threshold' | 'Control' | 'AI'

/**
 * alarm_id 의 2번째 글자(toString().substr(1, 1)) 기준으로 분류.
 * '1' → HW, '2' → SW, 그 외 → AI.
 */
export function classifyByAlarmId(alarmId: string): AlarmClassification {
  const c = alarmId.toString().substr(1, 1)
  if (c === '1') return 'HW'
  if (c === '2') return 'SW'
  return 'AI'
}

export function alarmTypeLabel(type: AlarmInfo['type']): AlarmTypeLabel {
  switch (type) {
    case 0:
      return 'ON/OFF'
    case 1:
      return 'Threshold'
    case 2:
      return 'Control'
    case 3:
    default:
      return 'AI'
  }
}
