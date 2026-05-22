'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { PumpGaugeItem } from '@/features/ems/types/ems'

interface Props {
  gauges: PumpGaugeItem[]
}

export function PumpGaugeCardGrid({ gauges }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>펌프 가동이력 요약</h3>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6'>
        {gauges.map((g) => (
          <PumpCard key={g.name} item={g} />
        ))}
      </div>
    </AioPanel>
  )
}

function PumpCard({ item }: { item: PumpGaugeItem }) {
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3 text-center'>
      <HalfGauge value={item.pumpingGaugeValue} />
      <div
        className='mt-2 text-sm font-semibold text-white'
        style={{ textShadow: 'var(--aio-text-glow)' }}
      >
        {item.name}
      </div>
      <ul className='mt-2 space-y-0.5 text-[10px] text-[var(--aio-subtitle)]'>
        <li>
          정격양정 <span className='font-semibold text-white'>{item.pumpingHead}</span>
        </li>
        <li>
          정격유량{' '}
          <span className='font-semibold text-white'>
            {item.pumpingStream.toLocaleString()}
          </span>
          <span className='ml-0.5'>m³</span>
        </li>
      </ul>
    </div>
  )
}

function HalfGauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  // SVG 반원 게이지. 180도 호.
  const r = 36
  const cx = 50
  const cy = 50
  const arc = (pct: number) => {
    const angle = Math.PI + (Math.PI * pct) / 100 // π → 2π (왼쪽→오른쪽)
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const
  }
  const [endX, endY] = arc(clamped)
  const largeArc = clamped > 50 ? 1 : 0
  const color = clamped < 30 ? '#f87171' : clamped < 70 ? '#fbbf24' : '#34d399'

  return (
    <div className='relative mx-auto h-14 w-24'>
      <svg viewBox='0 0 100 60' className='h-full w-full'>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke='rgba(255,255,255,0.1)'
          strokeWidth='8'
          fill='none'
          strokeLinecap='round'
        />
        {clamped > 0 ? (
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
            stroke={color}
            strokeWidth='8'
            fill='none'
            strokeLinecap='round'
          />
        ) : null}
      </svg>
      <div
        className='absolute inset-x-0 bottom-0 text-center text-sm font-semibold'
        style={{ color, textShadow: `0 0 6px ${color}88` }}
      >
        {clamped.toFixed(1)}%
      </div>
    </div>
  )
}
