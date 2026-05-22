import { describe, expect, it } from 'vitest'

import { alarmTypeLabel, classifyByAlarmId } from './classify'

describe('classifyByAlarmId', () => {
  it('2번째 글자 1 → HW', () => {
    expect(classifyByAlarmId('A1xx')).toBe('HW')
    expect(classifyByAlarmId('012')).toBe('HW')
  })

  it('2번째 글자 2 → SW', () => {
    expect(classifyByAlarmId('A2xx')).toBe('SW')
    expect(classifyByAlarmId('022')).toBe('SW')
  })

  it('그 외 → AI', () => {
    expect(classifyByAlarmId('A3xx')).toBe('AI')
    expect(classifyByAlarmId('033')).toBe('AI')
    expect(classifyByAlarmId('A')).toBe('AI')
  })
})

describe('alarmTypeLabel', () => {
  it('0 → ON/OFF', () => {
    expect(alarmTypeLabel(0)).toBe('ON/OFF')
  })

  it('1 → Threshold', () => {
    expect(alarmTypeLabel(1)).toBe('Threshold')
  })

  it('2 → Control', () => {
    expect(alarmTypeLabel(2)).toBe('Control')
  })

  it('3 → AI', () => {
    expect(alarmTypeLabel(3)).toBe('AI')
  })
})
