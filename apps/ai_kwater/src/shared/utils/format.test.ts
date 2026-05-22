import { describe, expect, it } from 'vitest'

import { formatNumberWithCommaFont, hoursToMs, isAIMode, minusToZero } from './format'

describe('formatNumberWithCommaFont', () => {
  it('천 단위 콤마 + 콤마에 Noto Sans CJK KR span 입힘', () => {
    const out = formatNumberWithCommaFont(1_234_567)
    expect(out).toContain('1')
    expect(out).toContain('234')
    expect(out).toContain('567')
    expect(out).toContain('Noto Sans CJK KR')
    expect(out.match(/<span/g)).toHaveLength(2)
  })

  it('string 입력 허용', () => {
    expect(formatNumberWithCommaFont('100')).toBe('100')
  })

  it('NaN / 유한하지 않은 값은 빈 문자열', () => {
    expect(formatNumberWithCommaFont('not-number')).toBe('')
    expect(formatNumberWithCommaFont(Number.POSITIVE_INFINITY)).toBe('')
  })

  it('소수도 포함', () => {
    const out = formatNumberWithCommaFont(1234.5)
    expect(out).toContain('1')
    expect(out).toContain('234.5')
  })
})

describe('hoursToMs', () => {
  it('1시간 = 3,600,000 ms', () => {
    expect(hoursToMs(1)).toBe(3_600_000)
  })

  it('0 = 0', () => {
    expect(hoursToMs(0)).toBe(0)
  })

  it('소수도 변환', () => {
    expect(hoursToMs(0.5)).toBe(1_800_000)
  })
})

describe('isAIMode', () => {
  it('0 은 false', () => {
    expect(isAIMode(0)).toBe(false)
  })

  it('null/undefined 는 false', () => {
    expect(isAIMode(null)).toBe(false)
    expect(isAIMode(undefined)).toBe(false)
  })

  it('1 / 2 / 다른 숫자는 true', () => {
    expect(isAIMode(1)).toBe(true)
    expect(isAIMode(2)).toBe(true)
    expect(isAIMode(99)).toBe(true)
  })
})

describe('minusToZero', () => {
  it('음수는 0', () => {
    expect(minusToZero(-1)).toBe(0)
    expect(minusToZero(-100)).toBe(0)
  })

  it('0 / 양수는 그대로', () => {
    expect(minusToZero(0)).toBe(0)
    expect(minusToZero(10)).toBe(10)
  })
})
