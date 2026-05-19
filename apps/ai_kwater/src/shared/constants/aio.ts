// 원본: 성남정수장/src/store/aio/modules/aio.js 의 상수들
// 환경 의존 (DEV_SERVER, VUE_APP_BASE_URL) 은 axios baseURL 로 대체되었으므로 제거.

export const SERVICE_URL = {
  XAI: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  EMS: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  PMS: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
} as const

export const DASHBOARD_TITLE = 'AI 스마트 정수장 운영 시스템'

export const SPRING = 0
export const SUMMER = 1
export const WINTER = 2
export type Season = typeof SPRING | typeof SUMMER | typeof WINTER

export const COLOR_HIGH = 'rgba(212, 110, 250, 0.4)'
export const COLOR_MID = 'rgba(126, 110, 250, 0.4)'

export interface PlotBand {
  color: string
  from: number
  to: number
  status: 'mid' | 'high'
}

export const PLOT_BANDS_SPRING: PlotBand[] = [
  { color: COLOR_MID, from: 9, to: 10, status: 'mid' },
  { color: COLOR_MID, from: 12, to: 13, status: 'mid' },
  { color: COLOR_MID, from: 17, to: 23, status: 'mid' },
  { color: COLOR_HIGH, from: 10, to: 12, status: 'high' },
  { color: COLOR_HIGH, from: 13, to: 17, status: 'high' },
]

export const PLOT_BANDS_SUMMER: PlotBand[] = [
  { color: COLOR_MID, from: 9, to: 10, status: 'mid' },
  { color: COLOR_MID, from: 12, to: 13, status: 'mid' },
  { color: COLOR_MID, from: 17, to: 23, status: 'mid' },
  { color: COLOR_HIGH, from: 10, to: 12, status: 'high' },
  { color: COLOR_HIGH, from: 13, to: 17, status: 'high' },
]

export const PLOT_BANDS_WINTER: PlotBand[] = [
  { color: COLOR_MID, from: 9, to: 10, status: 'mid' },
  { color: COLOR_MID, from: 12, to: 17, status: 'mid' },
  { color: COLOR_MID, from: 20, to: 22, status: 'mid' },
  { color: COLOR_HIGH, from: 10, to: 12, status: 'high' },
  { color: COLOR_HIGH, from: 17, to: 20, status: 'high' },
  { color: COLOR_HIGH, from: 22, to: 23, status: 'high' },
]

// dashboard / lists / paths 류 mutation 키는 신규에서 RTK Query 가 아닌 axios + TanStack Query 패턴이라 상수화 불필요.
// 알람·인증 등 도메인별 path 는 각 features/<x>/api 에서 직접 사용.
