import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ProcessLeftContentsLayout } from './ProcessLeftContentsLayout'

describe('ProcessLeftContentsLayout', () => {
  it('values 3개 + states 4개 렌더', () => {
    render(
      <ProcessLeftContentsLayout
        values={[
          { title: '원수 유입', value: 100, unit: 'm³/h' },
          { title: '잔류 응집제', value: 0.5, unit: 'mg/L' },
          { title: 'AI 추천', value: null, unit: '-' },
        ]}
        states={[
          { label: '펌프 #1', active: true },
          { label: '펌프 #2', active: false },
          { label: '펌프 #3', active: true },
          { label: '펌프 #4', active: false },
        ]}
      />,
    )

    expect(screen.getByText('원수 유입')).toBeInTheDocument()
    expect(screen.getByText('잔류 응집제')).toBeInTheDocument()
    expect(screen.getByText('AI 추천')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('0.5')).toBeInTheDocument()
    expect(screen.getByText('펌프 #1')).toBeInTheDocument()
    expect(screen.getByText('펌프 #4')).toBeInTheDocument()
  })

  it('value null 일 때 "—" 표시', () => {
    render(
      <ProcessLeftContentsLayout
        values={[{ title: '없음', value: null, unit: '-' }]}
        states={[]}
      />,
    )
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('percent 모드 state — value 0 이상이면 ON 톤', () => {
    render(
      <ProcessLeftContentsLayout
        values={[]}
        states={[
          { label: '밸브 A', percent: 50 },
          { label: '밸브 B', percent: 0 },
          { label: '밸브 C', percent: null },
        ]}
      />,
    )
    expect(screen.getByText('밸브 A')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('rightColumns=3 grid-cols-3 적용', () => {
    const { container } = render(
      <ProcessLeftContentsLayout
        values={[]}
        states={[
          { label: 'A', active: true },
          { label: 'B', active: false },
          { label: 'C', active: true },
        ]}
        rightColumns={3}
      />,
    )
    const stateGrid = container.querySelector('.grid-cols-3')
    expect(stateGrid).toBeInTheDocument()
  })
})
