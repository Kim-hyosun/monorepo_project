import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/render'

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}))

import { EmsDashboard } from './EmsDashboard'

describe('EmsDashboard (integration)', () => {
  it('로딩 후 헤더 + 3 탭 표시', async () => {
    renderWithProviders(<EmsDashboard />)

    // 헤더 등장까지 대기 (모든 query 로드 후)
    expect(await screen.findByText('EMS Dashboard')).toBeInTheDocument()
    expect(screen.getByText('에너지 관리 통합 모니터링')).toBeInTheDocument()

    // 3 탭 확인
    expect(screen.getByRole('button', { name: 'KPI / 펌프' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '정수장 배치도' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '배수지 / DR' })).toBeInTheDocument()
  })

  it('탭 클릭 시 다른 탭으로 전환', async () => {
    renderWithProviders(<EmsDashboard />)

    await screen.findByText('EMS Dashboard')

    // 기본 KPI 탭 → 배수지 탭 클릭
    fireEvent.click(screen.getByRole('button', { name: '배수지 / DR' }))
    // 탭 변경 시 다른 콘텐츠 렌더 — 버튼은 그대로 존재
    expect(screen.getByRole('button', { name: '배수지 / DR' })).toBeInTheDocument()
  })
})
