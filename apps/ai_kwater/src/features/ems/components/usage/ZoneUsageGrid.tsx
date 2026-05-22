'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ZoneRow } from '@/features/ems/types/ems'

interface Props {
  zones: ZoneRow[]
  totalKwh: number
}

const LABELS = ['순시전력', '전력량', '시간당 최대전력', '최대 전력 시간대']

export function ZoneUsageGrid({ zones, totalKwh }: Props) {
  return (
    <AioPanel className='p-4'>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-2'>
          <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>주요 인자</h3>
          <ul className='space-y-3 text-xs text-[var(--aio-subtitle)]'>
            {LABELS.map((l) => (
              <li
                key={l}
                className='rounded border border-[var(--aio-panel-border)] bg-black/30 px-3 py-2 text-white'
              >
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className='col-span-8'>
          <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>시설별 사용량</h3>
          <ul className='grid grid-cols-4 gap-3'>
            {zones.map((z, i) => (
              <li
                key={z.name}
                className={cnIf('rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3', i >= 4 ? 'translate-y-1' : '')}
              >
                <p
                  className='mb-2 text-center text-sm font-semibold text-white'
                  style={{ textShadow: 'var(--aio-text-glow)' }}
                >
                  {z.name}
                </p>
                <ol className='space-y-1 text-[11px]'>
                  <Row value={z.instantKw.toLocaleString()} unit='kW' />
                  <Row value={z.totalKwh.toLocaleString()} unit='kWh' />
                  <Row value={z.hourlyPeakKw.toLocaleString()} unit='kW' highlight />
                  <li className='text-[var(--aio-subtitle)]'>{z.peakHourDate}</li>
                </ol>
              </li>
            ))}
          </ul>
        </div>

        <div className='col-span-2'>
          <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>총 전력량</h3>
          <div
            className='rounded border border-[var(--aio-accent)]/40 bg-black/40 p-4 text-center'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            <strong className='text-2xl font-semibold text-white'>
              {totalKwh.toLocaleString()}
            </strong>
            <div className='mt-1 text-xs text-[var(--aio-subtitle)]'>kWh</div>
          </div>
        </div>
      </div>
    </AioPanel>
  )
}

function Row({ value, unit, highlight }: { value: string; unit: string; highlight?: boolean }) {
  return (
    <li className='flex items-baseline justify-between'>
      <span className={highlight ? 'font-semibold text-emerald-300' : 'text-white'}>{value}</span>
      <em className='ml-1 not-italic text-[var(--aio-subtitle)]'>{unit}</em>
    </li>
  )
}

function cnIf(base: string, extra: string) {
  return extra ? `${base} ${extra}` : base
}
