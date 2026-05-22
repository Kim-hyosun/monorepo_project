'use client'

/**
 * 정적 SVG sparkline — Highcharts 대체로 motor 카드별 미니 트렌드.
 * 18개 motor 마다 인스턴스화 가능 (Highcharts 18개 mount 대비 ~10ms vs ~1000ms).
 */
interface Props {
  data: Array<[number, number]>
  color?: string
  width?: number
  height?: number
}

export function MotorSparkline({ data, color = '#5cafff', width = 100, height = 24 }: Props) {
  if (data.length === 0) return <div style={{ height }} />

  const values = data.map(([, v]) => v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = data.length > 1 ? width / (data.length - 1) : 0

  const points = values
    .map((v, i) => {
      const x = (i * stepX).toFixed(1)
      const y = (height - ((v - min) / span) * height).toFixed(1)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width='100%'
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio='none'
      style={{ display: 'block', overflow: 'visible' }}
    >
      <polyline points={points} fill='none' stroke={color} strokeWidth='1.5' />
    </svg>
  )
}
