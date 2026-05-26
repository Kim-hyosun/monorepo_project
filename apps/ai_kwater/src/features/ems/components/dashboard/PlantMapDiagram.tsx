'use client'

import { useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { WaterFlowAnimation } from '@/features/ems/components/dashboard/WaterFlowAnimation'
import { ZoneInfoPopup } from '@/features/ems/components/dashboard/ZoneInfoPopup'
import type { Zone, ZoneCode } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  zones: Zone[]
}

interface Layout {
  code: ZoneCode
  top: string
  left: string
  width: string
  rotate?: number
  color: string
}

const LAYOUTS: Layout[] = [
  { code: '탈수기동', top: '50%', left: '6%', width: '120px', rotate: 7, color: '#5cafff' },
  { code: '오존설비동', top: '55%', left: '28%', width: '170px', rotate: 2, color: '#fbbf24' },
  { code: '송수펌프동', top: '40%', left: '50%', width: '170px', color: '#34d399' },
  { code: '관리동', top: '55%', left: '72%', width: '180px', color: '#a78bfa' },
  { code: '염소투입동', top: '15%', left: '60%', width: '130px', color: '#f87171' },
  { code: '원수동', top: '20%', left: '10%', width: '120px', color: '#7dd3fc' },
]

export function PlantMapDiagram({ zones }: Props) {
  const [hoverCode, setHoverCode] = useState<ZoneCode | null>(null)
  const byCode = new Map(zones.map((z) => [z.code, z]))
  const hoverZone = hoverCode ? byCode.get(hoverCode) : null

  return (
    <AioPanel className='relative h-[440px] overflow-hidden p-0'>
      <style>{`
        @keyframes plant-zone-ring {
          0%, 100% { box-shadow: 0 0 0 0 var(--ring-color), 0 0 18px var(--ring-color); }
          50% { box-shadow: 0 0 0 6px transparent, 0 0 26px var(--ring-color); }
        }
      `}</style>
      <WaterFlowAnimation />
      <div className='relative h-full w-full'>
        {LAYOUTS.map((l) => {
          const z = byCode.get(l.code)
          if (!z) return null
          const active = hoverCode === l.code
          const dim = hoverCode !== null && !active
          return (
            <button
              key={l.code}
              type='button'
              onMouseEnter={() => setHoverCode(l.code)}
              onMouseLeave={() => setHoverCode((c) => (c === l.code ? null : c))}
              onClick={() => {
                window.location.href = `/facUse?zoneName=${encodeURIComponent(l.code)}`
              }}
              className={cn(
                'absolute flex flex-col items-center transition-all duration-300 ease-out',
                active ? '-translate-y-3 scale-110' : '',
                dim ? 'opacity-40 grayscale' : '',
              )}
              style={{ top: l.top, left: l.left, width: l.width }}
            >
              {/* hover ring + zone gauge */}
              <div
                className={cn(
                  'relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-black/55 text-sm font-bold text-white transition-all',
                  active ? '' : 'opacity-95',
                )}
                style={{
                  borderColor: l.color,
                  ['--ring-color' as string]: `${l.color}aa`,
                  textShadow: `0 0 8px ${l.color}`,
                  ...(active
                    ? { animation: 'plant-zone-ring 1.6s ease-in-out infinite' }
                    : { boxShadow: `0 0 6px ${l.color}77` }),
                }}
              >
                {/* radial gauge ring (SVG) */}
                <svg viewBox='0 0 40 40' className='absolute inset-0' width='100%' height='100%'>
                  <circle
                    cx='20'
                    cy='20'
                    r='17'
                    fill='none'
                    stroke='rgba(255,255,255,0.08)'
                    strokeWidth='2'
                  />
                  <circle
                    cx='20'
                    cy='20'
                    r='17'
                    fill='none'
                    stroke={l.color}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeDasharray={`${(z.usagePct / 100) * 106.8} 106.8`}
                    transform='rotate(-90 20 20)'
                    opacity='0.85'
                  />
                </svg>
                <span className='relative z-10 text-[13px]'>{z.usagePct}%</span>
              </div>
              {/* zone label + LED indicator */}
              <div
                className='mt-1.5 flex items-center gap-1 rounded px-2 py-0.5 text-xs text-white'
                style={{
                  background: `linear-gradient(90deg, transparent, ${l.color}55, transparent)`,
                  transform: l.rotate ? `rotate(${l.rotate}deg)` : undefined,
                }}
              >
                <span
                  className='inline-block h-1.5 w-1.5 rounded-full'
                  style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }}
                />
                {l.code}
              </div>
              {/* mini KPI floating tooltip — hover 시 즉시 표시 */}
              {active ? (
                <div
                  className='pointer-events-none absolute top-[68px] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border bg-black/75 px-2 py-1 text-[10px] backdrop-blur'
                  style={{ borderColor: `${l.color}80` }}
                >
                  <div className='text-[var(--aio-subtitle)]'>전력소비</div>
                  <div
                    className='font-semibold text-white'
                    style={{ textShadow: `0 0 6px ${l.color}` }}
                  >
                    {z.totalKwh.toLocaleString()}
                    <span className='ml-0.5 text-[var(--aio-subtitle)]'>kWh</span>
                  </div>
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
      {hoverZone ? <ZoneInfoPopup zone={hoverZone} /> : null}
    </AioPanel>
  )
}
