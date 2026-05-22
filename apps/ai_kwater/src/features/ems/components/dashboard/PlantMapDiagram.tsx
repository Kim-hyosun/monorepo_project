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
      <WaterFlowAnimation />
      <div className='relative h-full w-full'>
        {LAYOUTS.map((l) => {
          const z = byCode.get(l.code)
          if (!z) return null
          const active = hoverCode === l.code
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
                'absolute flex flex-col items-center transition-transform',
                active ? '-translate-y-2 scale-105' : '',
              )}
              style={{ top: l.top, left: l.left, width: l.width }}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border bg-black/40 text-sm font-semibold text-white transition',
                  active ? 'shadow-[0_0_18px_var(--aio-accent)]' : '',
                )}
                style={{
                  borderColor: l.color,
                  color: '#fff',
                  textShadow: `0 0 8px ${l.color}`,
                }}
              >
                {z.usagePct}%
              </div>
              <div
                className='mt-1 rounded px-2 py-0.5 text-xs text-white'
                style={{
                  background: `linear-gradient(90deg, transparent, ${l.color}55, transparent)`,
                  transform: l.rotate ? `rotate(${l.rotate}deg)` : undefined,
                }}
              >
                {l.code}
              </div>
            </button>
          )
        })}
      </div>
      {hoverZone ? <ZoneInfoPopup zone={hoverZone} /> : null}
    </AioPanel>
  )
}
