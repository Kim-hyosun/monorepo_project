import type { CalculateResult } from '@sazuapp/client'

/** /api/sazu 응답 envelope */
export type SajuApiResponse =
  | { ok: true; data: CalculateResult }
  | {
      ok: false
      error: {
        code: string
        message: string
        status: number
        responseId?: string
        retryAfterSec?: number
        issues?: { path: string; message: string }[]
      }
    }

/** 지장간 (월령으로 천간에 작용하는 3가지 기운) */
export interface JiJangGanItem {
  /** 잔기 (residue) */
  residue?: { stem: string; days: number }
  /** 중기 (middle) */
  middle?: { stem: string; days: number }
  /** 정기 (main) */
  main?: { stem: string; days: number }
}

/** 12운성 해석 */
export interface TwelveFortuneInterpretation {
  keyword: string
  energy: string
  level: number
  positionMeaning?: string
}

/** 사주 원국 1기둥 */
export interface FourPillarItem {
  full: string
  sky: string
  earth: string
  skyElement?: string
  earthElement?: string
  /** 천간 풀명 (예: '갑목') */
  skyFull?: string
  /** 지지 풀명 (예: '술토') */
  earthFull?: string
  /** 천간 십신 */
  sippiSeong?: string
  /** 지지 십신 */
  earthSippiSeong?: string
  /** 12운성 (예: '관대') */
  twelveStage?: string
  /** 납음 (예: '산두화') */
  naeeum?: string
  jiJangGan?: JiJangGanItem
  twelveFortuneInterpretation?: TwelveFortuneInterpretation
}

export interface FourPillarsShape {
  year: FourPillarItem
  month: FourPillarItem
  day: FourPillarItem
  hour?: FourPillarItem
}

/** 오행 항목 — total/skyOnly/earthOnly */
export interface ElementCount {
  count: number
  percentage: number
}
export interface ElementItem {
  name?: string
  total: ElementCount
  skyOnly?: ElementCount
  earthOnly?: ElementCount
}

export interface ElementsShape {
  wood: ElementItem
  fire: ElementItem
  earth: ElementItem
  metal: ElementItem
  water: ElementItem
}

/** modules.summary */
export interface SummaryShape {
  dayMaster?: { char: string; element: string }
  elementBalance?: {
    dominant: string
    lacking: string | null
    score: number
    grade: string
  }
  harmony?: { score: number; grade: string; label: string }
  conflict?: { score: number; grade: string; label: string }
  positiveSpirits?: { count: number; notable: string[] }
  negativeSpirits?: { count: number; notable: string[] }
  fortunePhase?: {
    current?: { age: number; pillar: string; element: string }
    next?: { age: number; pillar: string; element: string }
  }
}

/** modules.sinStrength */
export interface SinStrengthShape {
  isStrong: boolean
  strength: string
  score: number
  description?: string
  analysis?: string
  bigyeopCount?: number
  inseongCount?: number
  deukryeong?: boolean
  deukji?: boolean
  deukse?: boolean
}

/** 대운 1개 */
export interface DecadeItem {
  index: number
  startAge: number
  full: string
  sky: string
  earth: string
  skyElement?: string
  earthElement?: string
  skyFull?: string
  earthFull?: string
  sipseong?: { gan: string; ganCategory: string }
  twelveFortune?: { name: string; keyword: string; level: number }
}

/** 대운 전체 */
export interface DecadeFortuneShape {
  direction: string
  startAge: number
  startDateTime?: string
  basisTermsName?: string
  basisDuration?: string
  list: DecadeItem[]
}

/** input 정규화 */
export interface InputShape {
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour?: number | null
  birthMinute?: number
  isLunar: boolean
  isFemale: boolean
  birthCity?: string
  isInternationalAge?: boolean
  correctedHour?: number
  correctedMinute?: number
}

/** timezone */
export interface TimezoneShape {
  city: string
  utcOffset: number
  correctionMinutes: number
}
