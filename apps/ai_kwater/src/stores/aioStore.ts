// 원본: 성남정수장/src/store/aio/modules/aio.js + drawer.js (selectedMainMenuIndex 일부) → Zustand.

import { create } from 'zustand'

import { DASHBOARD_TITLE } from '@/shared/constants/aio'

interface AioState {
  currentDashboardTitle: string
  /** API 요청 overlay loading flag. axios 인터셉터/페이지에서 토글. */
  overlay: boolean
  /** 1 = 'common', 그 외 = 'disinfection' (원본 backgroundImage getter) */
  backgroundIndex: number
  /** 현재 선택된 공정 index. 기본 0(착수). */
  selectedBuildingIndex: number
  /** 사이드바 메인 메뉴 활성 index. 원본 drawer.selectedMainMenuIndex 흡수. */
  selectedMainMenuIndex: number

  setOverlay: (overlay: boolean) => void
  setBackgroundIndex: (index: number) => void
  setSelectedBuildingIndex: (index: number) => void
  setSelectedMainMenuIndex: (index: number) => void
}

export const useAioStore = create<AioState>((set) => ({
  currentDashboardTitle: DASHBOARD_TITLE,
  overlay: false,
  backgroundIndex: 1,
  selectedBuildingIndex: 0,
  selectedMainMenuIndex: 0,

  setOverlay: (overlay) => set({ overlay }),
  setBackgroundIndex: (backgroundIndex) => set({ backgroundIndex }),
  setSelectedBuildingIndex: (selectedBuildingIndex) => set({ selectedBuildingIndex }),
  setSelectedMainMenuIndex: (selectedMainMenuIndex) => set({ selectedMainMenuIndex }),
}))

/** 원본 backgroundImage getter 대응 selector. */
export function selectBackgroundImage(state: AioState): 'common' | 'disinfection' {
  return state.backgroundIndex === 1 ? 'common' : 'disinfection'
}
