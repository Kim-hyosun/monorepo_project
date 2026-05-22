import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

import { MotorSparkline } from './MotorSparkline'

describe('MotorSparkline', () => {
  const data: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 1.5],
    [3, 3],
  ]

  it('data 길이만큼 polyline point 생성', () => {
    const { container } = render(<MotorSparkline data={data} />)
    const polyline = container.querySelector('polyline')
    expect(polyline).toBeInTheDocument()
    const points = polyline?.getAttribute('points') ?? ''
    // 4 점 → 콤마 4개 (각 x,y) + 공백 3개
    expect(points.split(' ')).toHaveLength(4)
  })

  it('빈 data 면 polyline 안 렌더', () => {
    const { container } = render(<MotorSparkline data={[]} />)
    expect(container.querySelector('polyline')).not.toBeInTheDocument()
  })

  it('color prop 으로 stroke 반영', () => {
    const { container } = render(<MotorSparkline data={data} color='#ff0000' />)
    const polyline = container.querySelector('polyline')
    expect(polyline?.getAttribute('stroke')).toBe('#ff0000')
  })

  it('기본 stroke 는 var(--aio-accent) 톤 #5cafff', () => {
    const { container } = render(<MotorSparkline data={data} />)
    const polyline = container.querySelector('polyline')
    expect(polyline?.getAttribute('stroke')).toBe('#5cafff')
  })

  it('height prop 반영', () => {
    const { container } = render(<MotorSparkline data={data} height={40} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('height')).toBe('40')
  })
})
