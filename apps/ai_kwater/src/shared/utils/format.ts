// 원본: 성남정수장/src/store/aio/modules/common.js Vue prototype helpers 중 포매팅 계열.

const NOTO_SANS_KR = 'Noto Sans CJK KR'

/**
 * 천 단위 콤마 + 콤마에만 Noto Sans CJK KR 폰트를 입히는 HTML string.
 * 원본 $getNumeralWithCommaAndFontFamily 1:1 대체.
 */
export function formatNumberWithCommaFont(value: number | string): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return ''
  const formatted = n.toLocaleString('en-US')
  return formatted.replace(/,/g, `<span style="font-family: ${NOTO_SANS_KR}">,</span>`)
}

/** 원본 $getMilliSecondFromHour */
export function hoursToMs(hours: number): number {
  return 1000 * 60 * 60 * hours
}

/** 원본 $isAIMode (0이 아니면 AI 모드) */
export function isAIMode(value: number | null | undefined): boolean {
  return value !== 0 && value !== null && value !== undefined
}

/** 원본 $minusToZero */
export function minusToZero(value: number): number {
  return value < 0 ? 0 : value
}

/** 원본 $speak — 한글을 음성으로 읽어줌. SSR-safe. */
export interface SpeakOptions {
  rate?: number
  pitch?: number
  lang?: string
}
export function speak(text: string, opt: SpeakOptions = {}): void {
  if (typeof window === 'undefined') return
  if (typeof window.SpeechSynthesisUtterance === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    // 원본은 alert 로 알렸지만 신규는 silent fail (글로벌 dialog 와 충돌 방지)
    return
  }
  window.speechSynthesis.cancel()
  const msg = new window.SpeechSynthesisUtterance()
  msg.rate = opt.rate ?? 1
  msg.pitch = opt.pitch ?? 1
  msg.lang = opt.lang ?? 'ko-KR'
  msg.text = text
  window.speechSynthesis.speak(msg)
}
