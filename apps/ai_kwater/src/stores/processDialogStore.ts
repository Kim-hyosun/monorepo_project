// 원본: 성남정수장/src/store/aio/modules/dialog/index.js → Zustand.
// 공정 페이지에서 사용하는 dialog visibility (alertStore 는 글로벌 dialog 별도).

import { create } from 'zustand'

import type { PmsAlert } from '@/features/pms/types/pms'

interface AiModeDialog {
  visible: boolean
  expectedValue: number | null
  disinfectionIndex: number | null
  stage: number | null
}

interface AiModeOfJiDialog {
  visible: boolean
  number: number | null
}

interface SimpleVisibleDialog {
  visible: boolean
}

interface AlarmNotifyDialog {
  visible: boolean
  alert: PmsAlert | null
  /** 새 알람 발생 시 자동 노출 여부 (dev 환경 기본 활성) */
  autoShow: boolean
  /** 자동 노출이 1회라도 표시한 알람 num set — 중복 방지 */
  shownNums: number[]
}

interface ProcessDetailDialog {
  visible: boolean
  processKey: string | null
}

interface ProcessDialogState {
  aiMode: AiModeDialog
  aiModeOfJi: AiModeOfJiDialog
  aiFilterNGACSchedule: SimpleVisibleDialog
  alarmNotify: AlarmNotifyDialog
  processDetail: ProcessDetailDialog

  openAiMode: (expectedValue: number, ctx?: { disinfectionIndex?: number; stage?: number }) => void
  closeAiMode: () => void
  openAiModeOfJi: (n?: number) => void
  closeAiModeOfJi: () => void
  openAiFilterNGACSchedule: () => void
  closeAiFilterNGACSchedule: () => void
  openAlarmNotify: (alert: PmsAlert) => void
  closeAlarmNotify: () => void
  setAlarmAutoShow: (autoShow: boolean) => void
  /** 새 알람 큐가 들어왔을 때 — autoShow 켜져있고 read=false 이고 미표시면 자동 open */
  autoShowAlarmIfNew: (alerts: PmsAlert[]) => void
  openProcessDetail: (processKey: string) => void
  closeProcessDetail: () => void
}

export const useProcessDialogStore = create<ProcessDialogState>((set) => ({
  aiMode: { visible: false, expectedValue: null, disinfectionIndex: null, stage: null },
  aiModeOfJi: { visible: false, number: null },
  aiFilterNGACSchedule: { visible: false },
  alarmNotify: { visible: false, alert: null, autoShow: true, shownNums: [] },
  processDetail: { visible: false, processKey: null },

  openAiMode: (expectedValue, ctx) =>
    set({
      aiMode: {
        visible: true,
        expectedValue,
        disinfectionIndex: ctx?.disinfectionIndex ?? null,
        stage: ctx?.stage ?? null,
      },
    }),
  closeAiMode: () =>
    set({ aiMode: { visible: false, expectedValue: null, disinfectionIndex: null, stage: null } }),

  openAiModeOfJi: (n) => set({ aiModeOfJi: { visible: true, number: n ?? null } }),
  closeAiModeOfJi: () => set({ aiModeOfJi: { visible: false, number: null } }),

  openAiFilterNGACSchedule: () => set({ aiFilterNGACSchedule: { visible: true } }),
  closeAiFilterNGACSchedule: () => set({ aiFilterNGACSchedule: { visible: false } }),

  openAlarmNotify: (alert) =>
    set((s) => ({
      alarmNotify: {
        ...s.alarmNotify,
        visible: true,
        alert,
        shownNums: s.alarmNotify.shownNums.includes(alert.num)
          ? s.alarmNotify.shownNums
          : [...s.alarmNotify.shownNums, alert.num],
      },
    })),
  closeAlarmNotify: () =>
    set((s) => ({ alarmNotify: { ...s.alarmNotify, visible: false, alert: null } })),
  setAlarmAutoShow: (autoShow) => set((s) => ({ alarmNotify: { ...s.alarmNotify, autoShow } })),
  autoShowAlarmIfNew: (alerts) =>
    set((s) => {
      if (!s.alarmNotify.autoShow) return {}
      if (s.alarmNotify.visible) return {} // 이미 표시 중
      const next = alerts.find((a) => a.read !== true && !s.alarmNotify.shownNums.includes(a.num))
      if (!next) return {}
      return {
        alarmNotify: {
          ...s.alarmNotify,
          visible: true,
          alert: next,
          shownNums: [...s.alarmNotify.shownNums, next.num],
        },
      }
    }),

  openProcessDetail: (processKey) => set({ processDetail: { visible: true, processKey } }),
  closeProcessDetail: () => set({ processDetail: { visible: false, processKey: null } }),
}))
