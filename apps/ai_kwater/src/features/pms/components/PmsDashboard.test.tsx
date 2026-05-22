import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/render'

// dynamic chart 들은 jsdom 에서 Highcharts 렌더 어려우므로 null 로 mock
vi.mock('next/dynamic', () => ({
  default: () => () => null,
}))

import { PmsDashboard } from './PmsDashboard'

describe('PmsDashboard (integration)', () => {
  it('헤더 + KPI 영역 표시', () => {
    renderWithProviders(<PmsDashboard />)

    expect(screen.getByText('PMS Dashboard')).toBeInTheDocument()
    expect(screen.getByText('펌프 모터 상태 통합 모니터링')).toBeInTheDocument()
    expect(screen.getByText('전체 설비')).toBeInTheDocument()
  })

  it('MSW 응답 → 설비 목록에 motor 이름 렌더', async () => {
    renderWithProviders(<PmsDashboard />)

    // mock 시드의 첫 motor 이름 등장까지 대기
    expect(await screen.findByText(/평택계통 송수펌프모터 #1/)).toBeInTheDocument()
    expect(screen.getByText('설비 목록')).toBeInTheDocument()
  })
})
