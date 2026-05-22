'use client'

import type { ReactNode } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'

export interface LeftValueItem {
  title: string
  value: number | null
  unit: string
  digits?: number
  /** locale toLocaleString 적용 (큰 수치 콤마) */
  bigNumber?: boolean
}

export interface RightStateItem {
  label: string
  /** valve 류 — 0~100 % */
  percent?: number | null
  /** ON/OFF / 가동 등 — active 여부 */
  active?: boolean
  /** 활성 라벨 (active=true 일 때 표시. 기본 'ON') */
  activeLabel?: string
  /** 비활성 라벨 (기본 'OFF') */
  inactiveLabel?: string
}

interface Props {
  /** 좌측 — 메인 KPI 2~4개 */
  values: LeftValueItem[]
  /** 우측 — valve/state 2~6개 */
  states: RightStateItem[]
  /** 좌측 추가 요소 (옵션, 화살표 위쪽에 위치) */
  extraLeft?: ReactNode
  /** 우측 추가 요소 (옵션, 화살표 아래쪽에 위치) */
  extraRight?: ReactNode
  /** 우측 grid columns (기본 2). 4개 초과면 3 권장 */
  rightColumns?: 2 | 3
}

/**
 * receiving 의 LeftContents 패턴을 7 공정에서 재사용.
 * 좌측 value 카드 + 중앙 흐름 애니메이션 + 우측 state/valve grid.
 * extraLeft/extraRight 슬롯으로 각 도메인 특수 컴포넌트(차트/슬라이더 등) 삽입 가능.
 */
export function ProcessLeftContentsLayout({
  values,
  states,
  extraLeft,
  extraRight,
  rightColumns = 2,
}: Props) {
  return (
    <AioPanel className='relative overflow-hidden p-4'>
      <style>{`
        @keyframes plc-arrow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
      <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
        {/* 좌측 — value */}
        <div className='space-y-2'>
          {values.map((v, i) => (
            <ValueBox key={i} item={v} />
          ))}
          {extraLeft}
        </div>

        {/* 중앙 — flow arrow */}
        <div className='flex h-full min-h-[120px] w-32 items-center justify-center'>
          <div className='relative h-3 w-full overflow-hidden rounded-full bg-[var(--aio-accent)]/15'>
            <span
              className='absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--aio-accent)] to-transparent'
              style={{ animation: 'plc-arrow 2.2s linear infinite' }}
            />
            <span
              className='absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[var(--aio-accent)]/70 to-transparent'
              style={{ animation: 'plc-arrow 2.2s linear 0.7s infinite' }}
            />
          </div>
        </div>

        {/* 우측 — state/valve */}
        <div>
          <div className={rightColumns === 3 ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
            {states.map((s, i) => (
              <StateBox key={i} item={s} />
            ))}
          </div>
          {extraRight}
        </div>
      </div>
    </AioPanel>
  )
}

function ValueBox({ item }: { item: LeftValueItem }) {
  const { title, value, unit, digits = 1, bigNumber } = item
  const display =
    value === null
      ? '—'
      : bigNumber
        ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : value.toLocaleString(undefined, { maximumFractionDigits: digits })
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
      <div className='text-[10px] tracking-wide text-[var(--aio-subtitle)]'>{title}</div>
      <div className='mt-1 flex items-baseline gap-1'>
        <span
          className={
            bigNumber ? 'text-xl font-semibold text-white' : 'text-2xl font-bold text-white'
          }
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {display}
        </span>
        <span className='text-[10px] text-[var(--aio-subtitle)]'>{unit}</span>
      </div>
    </div>
  )
}

function StateBox({ item }: { item: RightStateItem }) {
  const { label, percent, active, activeLabel = 'ON', inactiveLabel = 'OFF' } = item

  if (percent !== undefined) {
    const isOn = percent !== null && percent > 0
    return (
      <div
        className={`rounded-md border p-2 ${
          isOn
            ? 'border-emerald-300/40 bg-emerald-500/5'
            : 'border-[var(--aio-panel-border)] bg-black/30'
        }`}
      >
        <div className='text-[10px] text-[var(--aio-subtitle)]'>{label}</div>
        <div className='mt-1 flex items-baseline justify-between gap-1'>
          <span
            className={`text-lg font-semibold ${isOn ? 'text-emerald-200' : 'text-white/60'}`}
            style={isOn ? { textShadow: '0 0 8px rgba(110,231,183,0.45)' } : undefined}
          >
            {percent === null ? '—' : percent.toFixed(0)}
          </span>
          <span className='text-[10px] text-[var(--aio-subtitle)]'>%</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-md border p-2 ${
        active
          ? 'border-emerald-300/40 bg-emerald-500/5'
          : 'border-[var(--aio-panel-border)] bg-black/30'
      }`}
    >
      <div className='text-[10px] text-[var(--aio-subtitle)]'>{label}</div>
      <div
        className={`mt-1 text-sm font-semibold ${active ? 'text-emerald-200' : 'text-white/60'}`}
        style={active ? { textShadow: '0 0 8px rgba(110,231,183,0.45)' } : undefined}
      >
        {active ? activeLabel : inactiveLabel}
      </div>
    </div>
  )
}
