'use client'

/**
 * MonitorPage hero block 위에 마운트되는 보조 시각화 — vibration wave overlay + thermometer.
 * motor.png 3D 회전 위 절대 위치 SVG sine wave 와, 옆 thermometer SVG.
 */

interface VibrationOverlayProps {
  /** 0~10 정도 범위. 진폭 = clamp(value, 0.4, 8) * 1.5 */
  value: number
}

export function MotorVibrationOverlay({ value }: VibrationOverlayProps) {
  const amp = Math.min(8, Math.max(0.4, value)) * 1.5
  const stroke = value > 4 ? '#f87171' : value > 3 ? '#fbbf24' : '#5cafff'
  const speed = Math.max(0.8, 2.2 - value * 0.18)
  // sine wave path — 120 width, 30 height baseline 15
  const points: string[] = []
  const segments = 24
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 120
    const y = 15 + Math.sin((i / segments) * Math.PI * 4) * amp
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return (
    <div
      className='pointer-events-none absolute inset-x-0 bottom-1 flex justify-center'
      aria-hidden='true'
    >
      <style>{`
        @keyframes motor-vib-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
      `}</style>
      <svg
        viewBox='0 0 120 30'
        width='160'
        height='34'
        className='opacity-90'
        style={{
          filter: `drop-shadow(0 0 4px ${stroke})`,
          animation: `motor-vib-slide ${speed}s linear infinite`,
        }}
      >
        <path d={points.join(' ')} fill='none' stroke={stroke} strokeWidth='1.4' />
        <path
          d={points.join(' ')}
          fill='none'
          stroke={stroke}
          strokeWidth='0.6'
          opacity='0.5'
          transform='translate(20 0)'
        />
      </svg>
    </div>
  )
}

interface ThermometerProps {
  /** °C. 30~80 정도 표시 범위 */
  value: number
  min?: number
  max?: number
}

export function MotorThermometer({ value, min = 20, max = 80 }: ThermometerProps) {
  const clamped = Math.max(min, Math.min(max, value))
  const ratio = (clamped - min) / (max - min)
  const fillH = 70 * ratio // 70px 채울 수 있는 column 높이
  const color = value > 65 ? '#f87171' : value > 55 ? '#fbbf24' : '#34d399'
  return (
    <div className='flex shrink-0 items-end gap-2'>
      <svg width='28' height='110' viewBox='0 0 28 110' aria-hidden='true'>
        <defs>
          <linearGradient id='therm-fill' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor={color} stopOpacity='1' />
            <stop offset='100%' stopColor={color} stopOpacity='0.4' />
          </linearGradient>
        </defs>
        {/* tube outline */}
        <rect
          x='10'
          y='6'
          width='8'
          height='80'
          rx='4'
          fill='rgba(0,0,0,0.45)'
          stroke='var(--aio-panel-border)'
          strokeWidth='1'
        />
        {/* bulb */}
        <circle
          cx='14'
          cy='96'
          r='9'
          fill='rgba(0,0,0,0.45)'
          stroke='var(--aio-panel-border)'
          strokeWidth='1'
        />
        {/* fill column */}
        <rect x='11' y={86 - fillH} width='6' height={fillH} fill='url(#therm-fill)' />
        <circle cx='14' cy='96' r='7' fill={color} />
        {/* tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <line
            key={i}
            x1='18'
            x2='22'
            y1={86 - 70 * r}
            y2={86 - 70 * r}
            stroke='rgba(255,255,255,0.3)'
            strokeWidth='0.6'
          />
        ))}
      </svg>
      <div className='flex flex-col text-xs leading-tight'>
        <span className='text-[var(--aio-subtitle)] text-[10px]'>온도</span>
        <span className='font-semibold' style={{ color, textShadow: `0 0 6px ${color}66` }}>
          {value.toFixed(1)}
          <span className='ml-0.5 text-[10px] text-[var(--aio-subtitle)]'>℃</span>
        </span>
        <span className='mt-0.5 text-[9px] text-[var(--aio-subtitle)]'>
          {value > 65 ? '경보' : value > 55 ? '주의' : '정상'}
        </span>
      </div>
    </div>
  )
}
