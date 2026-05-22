'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { EnergyFactor } from '@/features/ems/types/ems'

interface Props {
  factor: EnergyFactor
}

interface Row {
  label: string
  value: number
  unit: string
  pct?: number
  highlight?: boolean
}

export function EnergyFactorsCard({ factor }: Props) {
  const usage: Row[] = [
    { label: '전일', value: factor.todayUsage, unit: 'kWh', pct: factor.dayPct },
    { label: '금월', value: factor.monthUsage, unit: 'kWh', pct: factor.monthPct },
    { label: '금년', value: factor.yearUsage, unit: 'kWh', pct: factor.yearPct },
  ]
  const save: Row[] = [
    { label: '전일', value: factor.todaySave, unit: 'kWh', highlight: true },
    { label: '금월', value: factor.monthSave, unit: 'kWh', highlight: true },
    { label: '금년', value: factor.yearSave, unit: 'kWh', highlight: true },
  ]
  const co2: Row[] = [
    { label: '전일', value: factor.todayCo2, unit: 'kg' },
    { label: '금월', value: factor.monthCo2, unit: 'kg' },
    { label: '금년', value: factor.yearCo2, unit: 'kg' },
  ]

  return (
    <AioPanel className='p-4'>
      <div className='grid grid-cols-2 gap-3'>
        <Block title='전력소비' badge='소비현황' rows={usage} now={factor.nowKw} nowUnit='kW' />
        <Block title='전력절감' badge='절감현황' rows={save} accent='emerald' />
      </div>
      <div className='mt-3'>
        <Block title='탄소절감' badge='탄소현황' rows={co2} accent='emerald' />
      </div>
    </AioPanel>
  )
}

function Block({
  title,
  badge,
  rows,
  now,
  nowUnit,
  accent,
}: {
  title: string
  badge: string
  rows: Row[]
  now?: number
  nowUnit?: string
  accent?: 'emerald'
}) {
  return (
    <div className='flex gap-3 rounded-md border border-[var(--aio-panel-border)] bg-black/20 p-3'>
      <div className='flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border border-[var(--aio-accent)]/40 text-xs text-[var(--aio-subtitle)]'>
        <span>{badge.slice(0, 2)}</span>
        <span>{badge.slice(2)}</span>
      </div>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-white' style={{ textShadow: 'var(--aio-text-glow)' }}>
            {title}
          </h4>
          {typeof now === 'number' ? (
            <div className='flex items-baseline gap-1'>
              <span className='text-lg font-semibold text-white'>{now.toLocaleString()}</span>
              <span className='text-xs text-[var(--aio-subtitle)]'>{nowUnit}</span>
            </div>
          ) : null}
        </div>
        <ul className='mt-2 space-y-1 text-xs'>
          {rows.map((r) => (
            <li key={r.label} className='flex items-center justify-between'>
              <span className='text-[var(--aio-subtitle)]'>{r.label}</span>
              <span className='flex items-baseline gap-1'>
                <span
                  className={accent === 'emerald' ? 'text-emerald-300' : 'text-white'}
                >
                  {r.value.toLocaleString()}
                </span>
                <span className='text-[var(--aio-subtitle)]'>{r.unit}</span>
                {typeof r.pct === 'number' ? (
                  <span className='ml-2 text-[var(--aio-subtitle)]'>
                    목표 {r.pct}%
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
