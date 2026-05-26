'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { Zone } from '@/features/ems/types/ems'

interface Props {
  zone: Zone
}

export function ZoneInfoPopup({ zone }: Props) {
  const max = Math.max(...zone.top3.map((f) => f.usageKwh), 1)
  // semicircle gauge for usagePct
  const pct = Math.max(0, Math.min(100, zone.usagePct))
  const r = 28
  const circumference = Math.PI * r // semicircle
  const dash = (pct / 100) * circumference

  return (
    <AioPanel className='absolute right-4 top-4 z-10 w-80 p-3 shadow-lg backdrop-blur'>
      {/* header: zone code + semicircle gauge */}
      <div className='mb-3 flex items-center gap-3'>
        <svg viewBox='-32 -32 64 36' width='72' height='40' aria-hidden='true'>
          <path
            d='M -28 0 A 28 28 0 0 1 28 0'
            fill='none'
            stroke='rgba(255,255,255,0.08)'
            strokeWidth='5'
            strokeLinecap='round'
          />
          <path
            d='M -28 0 A 28 28 0 0 1 28 0'
            fill='none'
            stroke='var(--aio-accent)'
            strokeWidth='5'
            strokeLinecap='round'
            strokeDasharray={`${dash} ${circumference}`}
            style={{ filter: 'drop-shadow(0 0 4px var(--aio-accent))' }}
          />
          <text
            x='0'
            y='-4'
            textAnchor='middle'
            fontSize='12'
            fontWeight='700'
            fill='#fff'
            style={{ textShadow: '0 0 6px var(--aio-accent)' }}
          >
            {pct}%
          </text>
        </svg>
        <div className='min-w-0 flex-1'>
          <div
            className='text-sm font-semibold text-white'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            {zone.code} 주요 설비
          </div>
          <div className='text-[10px] text-[var(--aio-subtitle)]'>
            전력소비 합계{' '}
            <span className='font-semibold text-white'>{zone.totalKwh.toLocaleString()}</span>
            <span className='ml-0.5'>kWh</span>
          </div>
        </div>
      </div>

      {/* TOP 3 bar list with percent label */}
      <div className='mb-1 flex items-center justify-between text-[10px] text-[var(--aio-subtitle)]'>
        <span>TOP 3 설비</span>
        <span>점유율</span>
      </div>
      <ul className='space-y-2'>
        {zone.top3.map((f, idx) => {
          const sharePct = (f.usageKwh / max) * 100
          const rankColor = idx === 0 ? '#fbbf24' : idx === 1 ? '#a3e635' : '#5cafff'
          return (
            <li key={f.name} className='text-xs'>
              <div className='mb-1 flex items-center justify-between'>
                <span className='flex items-center gap-1.5'>
                  <span
                    className='inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-black'
                    style={{
                      background: rankColor,
                      boxShadow: `0 0 6px ${rankColor}aa`,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className='text-white'>{f.name}</span>
                </span>
                <span className='text-[var(--aio-subtitle)]'>
                  <span className='text-white'>{f.usageKwh.toLocaleString()}</span>
                  <span className='ml-0.5'>kWh</span>
                </span>
              </div>
              <div className='relative h-2 w-full overflow-hidden rounded-full bg-white/8'>
                <div
                  className='h-full rounded-full transition-[width] duration-500 ease-out'
                  style={{
                    width: `${sharePct}%`,
                    background: `linear-gradient(90deg, ${rankColor}aa, var(--aio-accent))`,
                    boxShadow: `0 0 6px ${rankColor}`,
                  }}
                />
                <span className='absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-white/85'>
                  {sharePct.toFixed(0)}%
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div className='mt-3 border-t border-[var(--aio-panel-border)] pt-2 text-[10px] text-[var(--aio-subtitle)]'>
        클릭 시 시설별 사용량 페이지로 이동
      </div>
    </AioPanel>
  )
}
