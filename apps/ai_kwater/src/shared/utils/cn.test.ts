import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('단일 클래스 그대로 반환', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('여러 클래스 공백 연결', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('falsy 는 무시', () => {
    expect(cn('foo', false && 'no', null, undefined, '')).toBe('foo')
  })

  it('Tailwind 충돌 클래스는 뒤가 이김 (twMerge)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('객체 형식 — true 만 포함', () => {
    expect(cn({ active: true, hidden: false })).toBe('active')
  })

  it('배열 / 중첩 지원', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
