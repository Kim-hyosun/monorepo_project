// 원본: 성남정수장/src/store/aio/modules/dialog/index.js → Zustand.
// 공정 페이지에서 사용하는 dialog visibility (alertStore 는 글로벌 dialog 별도).

import { create } from 'zustand'

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

interface ProcessDialogState {
  aiMode: AiModeDialog
  aiModeOfJi: AiModeOfJiDialog
  aiFilterNGACSchedule: SimpleVisibleDialog
  alarmNotify: SimpleVisibleDialog

  openAiMode: (expectedValue: number, ctx?: { disinfectionIndex?: number; stage?: number }) => void
  closeAiMode: () => void
  openAiModeOfJi: (n?: number) => void
  closeAiModeOfJi: () => void
  openAiFilterNGACSchedule: () => void
  closeAiFilterNGACSchedule: () => void
  openAlarmNotify: () => void
  closeAlarmNotify: () => void
}

export const useProcessDialogStore = create<ProcessDialogState>((set) => ({
  aiMode: { visible: false, expectedValue: null, disinfectionIndex: null, stage: null },
  aiModeOfJi: { visible: false, number: null },
  aiFilterNGACSchedule: { visible: false },
  alarmNotify: { visible: true }, // 원본 default true

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

  openAlarmNotify: () => set({ alarmNotify: { visible: true } }),
  closeAlarmNotify: () => set({ alarmNotify: { visible: false } }),
}))
