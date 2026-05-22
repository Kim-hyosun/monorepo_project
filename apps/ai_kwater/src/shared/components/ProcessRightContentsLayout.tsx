'use client'

import type { ReactNode } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'

interface SecondaryKpi {
  label: string
  value: number | string | null
  unit?: string
  /** 차이 표시 (예: AI 추천 vs 현재). 색상은 양수=emerald, 음수=rose */
  delta?: number | null
  digits?: number
}

interface Props {
  title?: string
  /** 메인 차트 (TrendLineChart 등) — dynamic ssr:false 권장 */
  chart: ReactNode
  /** 보조 KPI 2~4개 (차트 아래) */
  kpis?: SecondaryKpi[]
  /** 추가 컴포넌트 (KPI 아래) */
  footer?: ReactNode
  className?: string
}

/**
 * 7 도메인 우측 contents — LeftContents 와 짝.
 * AioPanel 안에 [title?] + [메인 차트] + [보조 KPI 그리드] + [footer?] 수직 stack.
 */
export function ProcessRightContentsLayout({ title, chart, kpis, footer, className }: Props) {
  return (
    <AioPanel className={`p-4 ${className ?? ''}`}>
      {title ? (
        <h3
          className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {title}
        </h3>
      ) : null}
      {chart}
      {kpis && kpis.length > 0 ? (
        <div className={`mt-3 grid gap-2 ${kpiGridClass(kpis.length)}`}>
          {kpis.map((k, i) => (
            <KpiSmall key={i} kpi={k} />
          ))}
        </div>
      ) : null}
      {footer}
    </AioPanel>
  )
}

function kpiGridClass(n: number): string {
  if (n >= 4) return 'grid-cols-4'
  if (n === 3) return 'grid-cols-3'
  return 'grid-cols-2'
}

function KpiSmall({ kpi }: { kpi: SecondaryKpi }) {
  const { label, value, unit, delta, digits = 2 } = kpi
  const display =
    value === null
      ? '—'
      : typeof value === 'number'
        ? value.toLocaleString(undefined, { maximumFractionDigits: digits })
        : value
  const deltaColor =
    delta === null || delta === undefined
      ? null
      : delta > 0
        ? 'text-emerald-300'
        : delta < 0
          ? 'text-rose-300'
          : 'text-white/50'
  return (
    <div className='rounded border border-[var(--aio-panel-border)] bg-black/30 p-2'>
      <div className='text-[10px] text-[var(--aio-subtitle)]'>{label}</div>
      <div className='mt-1 flex items-baseline justify-between gap-1'>
        <span className='text-base font-semibold text-white'>
          {display}
          {unit ? (
            <span className='ml-0.5 text-[10px] text-[var(--aio-subtitle)]'>{unit}</span>
          ) : null}
        </span>
        {deltaColor && delta !== null && delta !== undefined ? (
          <span className={`text-[10px] font-medium ${deltaColor}`}>
            {delta > 0 ? '▲' : delta < 0 ? '▼' : '·'} {Math.abs(delta).toFixed(digits)}
          </span>
        ) : null}
      </div>
    </div>
  )
}
