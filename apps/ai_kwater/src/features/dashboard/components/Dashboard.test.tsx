import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/render'

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}))

import { Dashboard } from './Dashboard'

describe('Dashboard aio (integration)', () => {
  it('제목 + AI 자율운영 라벨 표시', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('성남정수장 AI 자율운영 시스템')).toBeInTheDocument()
    expect(screen.getByText('AI 자율운영 엔진')).toBeInTheDocument()
    expect(screen.getByText('주요감시현황 →')).toBeInTheDocument()
  })

  it('Main Factor KPI 카드 4종 라벨 등장 (query 로드 전이라도 라벨 자체는 존재)', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('원수 탁도')).toBeInTheDocument()
    expect(screen.getByText('원수 유입 유량')).toBeInTheDocument()
    expect(screen.getByText('정수 출구 탁도')).toBeInTheDocument()
    expect(screen.getByText('잔류 염소 (후)')).toBeInTheDocument()
  })

  it('자율운영 정보 / 정수장 공정 배치 섹션 헤더', async () => {
    renderWithProviders(<Dashboard />)

    expect(await screen.findByText('자율운영 정보')).toBeInTheDocument()
    expect(screen.getByText('정수장 공정 배치')).toBeInTheDocument()
  })
})
