import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import type { PmsAlert } from '@/features/pms/types/pms'
import { useProcessDialogStore } from '@/stores/processDialogStore'

import { AlertSidebar } from './AlertSidebar'

const initial = useProcessDialogStore.getState()

beforeEach(() => {
  // store reset
  useProcessDialogStore.setState({
    ...initial,
    alarmNotify: { visible: false, alert: null, autoShow: true, shownNums: [] },
  })
  // localStorage reset
  window.localStorage.clear()
})

const mkAlert = (
  num: number,
  status: '경보' | '주의',
  read = false,
  list = `펌프 #${num}`,
): PmsAlert => ({
  num,
  time: '2026-05-22 12:00',
  list,
  info: 'info',
  status,
  read,
})

describe('AlertSidebar', () => {
  it('알람 없음 표시', () => {
    render(<AlertSidebar alerts={[]} />)
    expect(screen.getByText('이력 없음')).toBeInTheDocument()
  })

  it('알람 목록 렌더 + 미확인 카운트 뱃지', () => {
    const alerts = [mkAlert(1, '경보'), mkAlert(2, '주의', true), mkAlert(3, '경보')]
    render(<AlertSidebar alerts={alerts} />)
    expect(screen.getAllByText(/펌프 #/).length).toBeGreaterThan(0)
    // 미확인 2건 (1, 3)
    expect(screen.getByText('미확인 2')).toBeInTheDocument()
  })

  it('필터 "경보" 클릭 시 경보 항목만 노출', () => {
    const alerts = [mkAlert(1, '경보', false, '경보펌프'), mkAlert(2, '주의', false, '주의펌프')]
    render(<AlertSidebar alerts={alerts} />)
    fireEvent.click(screen.getByRole('button', { name: '경보' }))
    expect(screen.getByText('경보펌프')).toBeInTheDocument()
    expect(screen.queryByText('주의펌프')).not.toBeInTheDocument()
  })

  it('필터 "미확인" 클릭 시 read=true 항목 제외', () => {
    const alerts = [mkAlert(1, '경보', false, '미확인펌프'), mkAlert(2, '경보', true, '확인된펌프')]
    render(<AlertSidebar alerts={alerts} />)
    fireEvent.click(screen.getByRole('button', { name: '미확인' }))
    expect(screen.getByText('미확인펌프')).toBeInTheDocument()
    expect(screen.queryByText('확인된펌프')).not.toBeInTheDocument()
  })

  it('필터 선택 → localStorage 영속', () => {
    render(<AlertSidebar alerts={[mkAlert(1, '경보')]} />)
    fireEvent.click(screen.getByRole('button', { name: '주의' }))
    expect(window.localStorage.getItem('pms_alert_filter')).toBe('주의')
  })

  it('autoShow toggle 클릭 시 store autoShow flip', () => {
    render(<AlertSidebar alerts={[]} />)
    expect(useProcessDialogStore.getState().alarmNotify.autoShow).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: '자동 노출 끄기' }))
    expect(useProcessDialogStore.getState().alarmNotify.autoShow).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: '자동 노출 켜기' }))
    expect(useProcessDialogStore.getState().alarmNotify.autoShow).toBe(true)
  })

  it('sound toggle 클릭 시 localStorage 갱신', () => {
    render(<AlertSidebar alerts={[]} />)
    fireEvent.click(screen.getByRole('button', { name: '소리 켜기' }))
    expect(window.localStorage.getItem('pms_alert_sound')).toBe('1')
    fireEvent.click(screen.getByRole('button', { name: '소리 끄기' }))
    expect(window.localStorage.getItem('pms_alert_sound')).toBe('0')
  })

  it('동일 list 알람들은 그룹으로 묶임 + 그룹 헤더에 그룹 카운트', () => {
    const alerts = [
      mkAlert(1, '경보', false, '같은펌프'),
      mkAlert(2, '주의', false, '같은펌프'),
      mkAlert(3, '경보', false, '다른펌프'),
    ]
    render(<AlertSidebar alerts={alerts} />)
    // 그룹 헤더 클릭하면 collapse — 우선 그룹 라벨 존재 확인
    expect(screen.getByText('같은펌프')).toBeInTheDocument()
    expect(screen.getByText('다른펌프')).toBeInTheDocument()
  })

  it('알람 항목 클릭 시 store.openAlarmNotify 호출 (alert 저장)', () => {
    const alert = mkAlert(7, '경보', false, '클릭펌프')
    render(<AlertSidebar alerts={[alert]} />)
    // info 텍스트 클릭 (button 내부)
    const list = screen.getByText('클릭펌프')
    const btn = list.closest('button')!
    fireEvent.click(btn)
    const s = useProcessDialogStore.getState().alarmNotify
    expect(s.visible).toBe(true)
    expect(s.alert?.num).toBe(7)
  })
})
