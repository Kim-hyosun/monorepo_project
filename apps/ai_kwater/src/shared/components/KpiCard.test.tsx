import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  it('label / value / unit 렌더', () => {
    render(<KpiCard label='원수 유입' value={3650} unit='m³/h' />)
    expect(screen.getByText('원수 유입')).toBeInTheDocument()
    expect(screen.getByText('3650')).toBeInTheDocument()
    expect(screen.getByText('m³/h')).toBeInTheDocument()
  })

  it('value 가 null / undefined / 빈 문자열 이면 "-" 표시', () => {
    const { rerender } = render(<KpiCard label='x' value={null} />)
    expect(screen.getByText('-')).toBeInTheDocument()
    rerender(<KpiCard label='x' value={undefined} />)
    expect(screen.getByText('-')).toBeInTheDocument()
    rerender(<KpiCard label='x' value='' />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('unit 미지정 시 unit span 안 보임', () => {
    render(<KpiCard label='상태' value='ON' />)
    expect(screen.queryByText('m³/h')).not.toBeInTheDocument()
  })

  it('variant=dark 일 때 다크 토큰 클래스 적용', () => {
    const { container } = render(<KpiCard label='x' value={1} variant='dark' />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('var(--aio-panel)')
  })

  it('variant=dark + highlight 조합', () => {
    const { container } = render(<KpiCard label='x' value={1} variant='dark' highlight />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('var(--aio-panel)')
  })

  it('light variant 에서 highlight 시 primary 톤', () => {
    const { container } = render(<KpiCard label='x' value={1} highlight />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-primary/40')
  })
})
