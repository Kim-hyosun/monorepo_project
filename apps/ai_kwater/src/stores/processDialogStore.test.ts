import { beforeEach, describe, expect, it } from 'vitest'

import type { PmsAlert } from '@/features/pms/types/pms'

import { useProcessDialogStore } from './processDialogStore'

const initial = useProcessDialogStore.getState()

beforeEach(() => {
  // 매 테스트 후 store reset (autoShow 기본값 true 포함)
  useProcessDialogStore.setState({
    ...initial,
    alarmNotify: { visible: false, alert: null, autoShow: true, shownNums: [] },
  })
})

const mkAlert = (num: number, read = false): PmsAlert => ({
  num,
  time: '2026-05-22 00:00',
  list: `펌프 #${num}`,
  info: 'test',
  status: '경보',
  read,
})

describe('processDialogStore — alarmNotify', () => {
  it('초기 상태: visible=false, alert=null, autoShow=true, shownNums=[]', () => {
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(false)
    expect(s.alert).toBeNull()
    expect(s.autoShow).toBe(true)
    expect(s.shownNums).toEqual([])
  })

  it('openAlarmNotify — visible=true / alert 저장 / shownNums 에 추가', () => {
    const alert = mkAlert(1)
    useProcessDialogStore.getState().openAlarmNotify(alert)
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(true)
    expect(s.alert?.num).toBe(1)
    expect(s.shownNums).toEqual([1])
  })

  it('openAlarmNotify 같은 num 두 번 호출 시 shownNums 중복 X', () => {
    const alert = mkAlert(5)
    useProcessDialogStore.getState().openAlarmNotify(alert)
    useProcessDialogStore.getState().openAlarmNotify(alert)
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.shownNums).toEqual([5])
  })

  it('closeAlarmNotify — visible=false, alert=null, shownNums 유지', () => {
    useProcessDialogStore.getState().openAlarmNotify(mkAlert(1))
    useProcessDialogStore.getState().closeAlarmNotify()
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(false)
    expect(s.alert).toBeNull()
    expect(s.shownNums).toEqual([1])
  })

  it('setAlarmAutoShow — autoShow flag 갱신', () => {
    useProcessDialogStore.getState().setAlarmAutoShow(false)
    expect(useProcessDialogStore.getState().alarmNotify.autoShow).toBe(false)
    useProcessDialogStore.getState().setAlarmAutoShow(true)
    expect(useProcessDialogStore.getState().alarmNotify.autoShow).toBe(true)
  })
})

describe('processDialogStore — autoShowAlarmIfNew', () => {
  it('autoShow=false 면 visible 변하지 않음', () => {
    useProcessDialogStore.getState().setAlarmAutoShow(false)
    useProcessDialogStore.getState().autoShowAlarmIfNew([mkAlert(1)])
    expect(useProcessDialogStore.getState().alarmNotify.visible).toBe(false)
  })

  it('autoShow=true + 미확인 첫 알람 있으면 자동 open', () => {
    useProcessDialogStore.getState().autoShowAlarmIfNew([mkAlert(1), mkAlert(2)])
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(true)
    expect(s.alert?.num).toBe(1)
    expect(s.shownNums).toContain(1)
  })

  it('이미 visible 이면 다시 열지 않음', () => {
    useProcessDialogStore.getState().openAlarmNotify(mkAlert(1))
    useProcessDialogStore.getState().autoShowAlarmIfNew([mkAlert(2)])
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.alert?.num).toBe(1) // 첫 알람 그대로
  })

  it('read=true 인 알람만 있으면 skip', () => {
    useProcessDialogStore.getState().autoShowAlarmIfNew([mkAlert(1, true), mkAlert(2, true)])
    expect(useProcessDialogStore.getState().alarmNotify.visible).toBe(false)
  })

  it('이미 shownNums 에 있는 알람은 skip, 그 다음 미확인 알람 선택', () => {
    useProcessDialogStore.getState().openAlarmNotify(mkAlert(1))
    useProcessDialogStore.getState().closeAlarmNotify()
    // 이제 shownNums=[1], visible=false
    useProcessDialogStore.getState().autoShowAlarmIfNew([mkAlert(1), mkAlert(2)])
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(true)
    expect(s.alert?.num).toBe(2)
  })

  it('미확인 알람 0 이면 skip', () => {
    useProcessDialogStore.getState().autoShowAlarmIfNew([])
    expect(useProcessDialogStore.getState().alarmNotify.visible).toBe(false)
  })
})
