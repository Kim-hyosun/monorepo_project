'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

interface Props {
  title: string
  value: number | string | null
  unit?: string
  digits?: number
  trend: Array<[number, number]>
  color?: string
  /** 추가 sub-KPI 표시 */
  badge?: string | null
  height?: number
}

/**
 * 원본 성남정수장/components/aio/disinfection/chart/ChartBoxComponent.vue 의
 * 1 KPI 박스 + mini trend 짝 컴포넌트.
 */
export default function ChartBoxComponent({
  title,
  value,
  unit,
  digits = 2,
  trend,
  color = '#5cafff',
  badge = null,
  height = 140,
}: Props) {
  const display =
    value === null
      ? '—'
      : typeof value === 'number'
        ? value.toLocaleString(undefined, { maximumFractionDigits: digits })
        : value
  return (
    <AioPanel className='p-3'>
      <div className='flex items-center justify-between'>
        <div className='text-xs tracking-wide text-[var(--aio-subtitle)]'>{title}</div>
        {badge ? (
          <span className='rounded-full bg-[var(--aio-accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--aio-accent)]'>
            {badge}
          </span>
        ) : null}
      </div>
      <div className='mt-1 flex items-baseline gap-1'>
        <span
          className='text-2xl font-bold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {display}
        </span>
        {unit ? <span className='text-[10px] text-[var(--aio-subtitle)]'>{unit}</span> : null}
      </div>
      <div className='mt-2'>
        <MiniDarkTrendChart data={trend} color={color} height={height} />
      </div>
    </AioPanel>
  )
}
