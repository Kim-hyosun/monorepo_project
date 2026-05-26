'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SongsuReservoir, SongsuReservoirLine, SongsuValve } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  reservoirs: SongsuReservoir[]
}

const LINE_LABELS = ['①', '②', '③', '④']

/**
 * 11 배수지 펌프 운영현황 — 원본 SVG 도식 1:1 픽셀매칭.
 * 단일 line: [배수지 카드] → 유입 pipe(SVG dash flow) → 밸브-IN 2(SVG LED) → 수위 탱크(SVG gradient + tick) → 밸브-OUT 2 → 유출 pipe
 * multi-line: 같은 배수지의 라인 ①②③④ indicator + stacked.
 */
export function ReservoirOperationGrid({ reservoirs }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>펌프 운영현황</h3>
      <ReservoirSvgDefs />
      <div className='space-y-2'>
        {reservoirs.map((r) => (
          <ReservoirRow key={r.name} reservoir={r} />
        ))}
      </div>
    </AioPanel>
  )
}

/** SVG 공통 defs — gradient/marker/filter 1회만 선언 */
function ReservoirSvgDefs() {
  return (
    <svg width='0' height='0' className='absolute' aria-hidden='true'>
      <defs>
        <linearGradient id='tank-grad' x1='0' y1='1' x2='0' y2='0'>
          <stop offset='0%' stopColor='var(--aio-accent)' stopOpacity='0.9' />
          <stop offset='100%' stopColor='var(--aio-accent)' stopOpacity='0.25' />
        </linearGradient>
        <radialGradient id='valve-on-grad' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#a7f3d0' stopOpacity='1' />
          <stop offset='60%' stopColor='#34d399' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#059669' stopOpacity='0.6' />
        </radialGradient>
        <radialGradient id='valve-off-grad' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#1f2937' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#0b1220' stopOpacity='1' />
        </radialGradient>
        <filter id='valve-glow'>
          <feGaussianBlur stdDeviation='1.5' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <marker
          id='arrow-right'
          viewBox='0 0 10 10'
          refX='9'
          refY='5'
          markerWidth='6'
          markerHeight='6'
          orient='auto-start-reverse'
        >
          <path d='M0,0 L10,5 L0,10 Z' fill='var(--aio-accent)' />
        </marker>
        <marker
          id='arrow-right-dim'
          viewBox='0 0 10 10'
          refX='9'
          refY='5'
          markerWidth='6'
          markerHeight='6'
          orient='auto-start-reverse'
        >
          <path d='M0,0 L10,5 L0,10 Z' fill='rgba(255,255,255,0.2)' />
        </marker>
      </defs>
    </svg>
  )
}

function ReservoirRow({ reservoir }: { reservoir: SongsuReservoir }) {
  const multi = reservoir.lines.length > 1
  return (
    <div className='flex items-stretch gap-2 rounded-md border border-[var(--aio-panel-border)] bg-black/20 p-2'>
      <ReservoirLabel reservoir={reservoir} />
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        {reservoir.lines.map((line, i) => (
          <LineRow key={i} line={line} lineIndex={i} showLineIndicator={multi} />
        ))}
      </div>
    </div>
  )
}

function ReservoirLabel({ reservoir }: { reservoir: SongsuReservoir }) {
  return (
    <div className='relative flex w-24 shrink-0 flex-col justify-center overflow-hidden rounded border border-[var(--aio-accent)]/30 bg-gradient-to-br from-[var(--aio-accent)]/15 to-[var(--aio-accent)]/5 p-2 text-center'>
      <span
        className='pointer-events-none absolute inset-x-0 top-0 h-px'
        style={{
          background: 'linear-gradient(90deg, transparent, var(--aio-accent), transparent)',
        }}
      />
      <div
        className='text-sm font-semibold text-white'
        style={{ textShadow: 'var(--aio-text-glow)' }}
      >
        {reservoir.name}
      </div>
      {reservoir.headerValue !== null ? (
        <div className='mt-0.5 text-[10px] text-[var(--aio-subtitle)]'>
          {reservoir.headerValue.toFixed(2)}
        </div>
      ) : null}
    </div>
  )
}

function LineRow({
  line,
  lineIndex,
  showLineIndicator,
}: {
  line: SongsuReservoirLine
  lineIndex: number
  showLineIndicator: boolean
}) {
  return (
    <div className='flex min-w-0 items-center gap-2 text-xs'>
      {showLineIndicator ? <LineBadge index={lineIndex} /> : null}

      <FlowSegment value={line.inflow} unit='m³/h' direction='right' />
      <ValvePair valves={line.valvesIn} />
      <WaterTank levels={line.waterLevels} />
      <ValvePair valves={line.valvesOut} />
      <FlowSegment value={line.outflow} unit='m³/h' direction='right' />
    </div>
  )
}

function LineBadge({ index }: { index: number }) {
  return (
    <svg width='18' height='18' viewBox='0 0 20 20' className='shrink-0' aria-hidden='true'>
      <circle
        cx='10'
        cy='10'
        r='8'
        fill='rgba(92,175,255,0.12)'
        stroke='var(--aio-accent)'
        strokeOpacity='0.4'
        strokeWidth='1'
      />
      <text
        x='10'
        y='13.5'
        textAnchor='middle'
        fontSize='10'
        fill='var(--aio-accent)'
        fontWeight='600'
      >
        {LINE_LABELS[index] ?? `L${index + 1}`}
      </text>
    </svg>
  )
}

function FlowSegment({
  value,
  unit,
  direction,
}: {
  value: number | null
  unit: string
  direction: 'left' | 'right'
}) {
  const active = value !== null && value > 0
  return (
    <div className='flex min-w-[80px] flex-1 items-center gap-1'>
      <svg viewBox='0 0 100 8' preserveAspectRatio='none' className='h-2 flex-1' aria-hidden='true'>
        <rect
          x='0'
          y='2'
          width='100'
          height='4'
          rx='2'
          fill={active ? 'rgba(92,175,255,0.18)' : 'rgba(255,255,255,0.08)'}
        />
        {active ? (
          <>
            <line
              x1={direction === 'right' ? 0 : 100}
              y1='4'
              x2={direction === 'right' ? 100 : 0}
              y2='4'
              stroke='var(--aio-accent)'
              strokeWidth='2'
              strokeDasharray='8 6'
              strokeLinecap='round'
              markerEnd={direction === 'right' ? 'url(#arrow-right)' : undefined}
              markerStart={direction === 'left' ? 'url(#arrow-right)' : undefined}
              style={{
                animation: `pipe-dash 1.2s linear infinite`,
                animationDirection: direction === 'left' ? 'reverse' : 'normal',
                filter: 'drop-shadow(0 0 3px rgba(92,175,255,0.55))',
              }}
            />
          </>
        ) : (
          <line
            x1='0'
            y1='4'
            x2='100'
            y2='4'
            stroke='rgba(255,255,255,0.15)'
            strokeWidth='1.4'
            strokeDasharray='3 3'
            markerEnd='url(#arrow-right-dim)'
          />
        )}
        <style>{`
          @keyframes pipe-dash {
            0% { stroke-dashoffset: 14; }
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
      </svg>
      <span className='min-w-[56px] text-right text-[10px]'>
        {value === null ? (
          <span className='text-white/30'>—</span>
        ) : (
          <>
            <span className='text-white'>{value.toFixed(1)}</span>
            <span className='ml-0.5 text-[var(--aio-subtitle)]'>{unit}</span>
          </>
        )}
      </span>
    </div>
  )
}

function ValvePair({ valves }: { valves: [SongsuValve | null, SongsuValve | null] }) {
  return (
    <div className='flex shrink-0 gap-1'>
      {valves.map((v, i) => (
        <ValveNode key={i} valve={v} />
      ))}
    </div>
  )
}

function ValveNode({ valve }: { valve: SongsuValve | null }) {
  const size = 30
  if (!valve) {
    return (
      <svg width={size} height={size} viewBox='0 0 30 30' aria-hidden='true'>
        <circle
          cx='15'
          cy='15'
          r='12'
          fill='none'
          stroke='rgba(255,255,255,0.1)'
          strokeDasharray='2 2'
        />
        <text x='15' y='18' textAnchor='middle' fontSize='10' fill='rgba(255,255,255,0.3)'>
          —
        </text>
      </svg>
    )
  }
  const on = valve.state === 'on'
  const opening = Math.max(0, Math.min(100, valve.opening))
  const arcEnd = (opening / 100) * 360
  return (
    <div
      className={cn('relative inline-block', on && 'animate-pulse [animation-duration:2.4s]')}
      title={`${valve.state.toUpperCase()} · ${valve.opening.toFixed(0)}%`}
    >
      <svg width={size} height={size} viewBox='0 0 30 30' aria-hidden='true'>
        {/* outer ring */}
        <circle
          cx='15'
          cy='15'
          r='13'
          fill={on ? 'url(#valve-on-grad)' : 'url(#valve-off-grad)'}
          stroke={on ? 'rgba(167,243,208,0.9)' : 'rgba(255,255,255,0.2)'}
          strokeWidth='1'
          filter={on ? 'url(#valve-glow)' : undefined}
        />
        {/* opening arc (open valve only) */}
        {on ? (
          <path
            d={describeArc(15, 15, 10, 0, arcEnd)}
            fill='none'
            stroke='#ecfdf5'
            strokeWidth='2'
            strokeLinecap='round'
            opacity='0.85'
          />
        ) : null}
        {/* center text */}
        <text
          x='15'
          y='18'
          textAnchor='middle'
          fontSize={on ? '9' : '8'}
          fontWeight='600'
          fill={on ? '#ecfdf5' : 'rgba(255,255,255,0.4)'}
        >
          {on ? Math.round(opening) : 'OFF'}
        </text>
      </svg>
    </div>
  )
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return ['M', start.x, start.y, 'A', r, r, 0, largeArc, 0, end.x, end.y].join(' ')
}

function WaterTank({ levels }: { levels: [number | null, number | null] }) {
  const [upper, lower] = levels
  const total = (upper ?? 0) + (lower ?? 0)
  const ratio = total > 0 ? ((upper ?? 0) / total) * 100 : 0
  const fillH = Math.min(40, Math.max(4, (ratio / 100) * 40))
  return (
    <div className='flex shrink-0 items-end gap-1'>
      <svg width='30' height='44' viewBox='0 0 30 44' aria-hidden='true'>
        {/* tank frame */}
        <rect
          x='4'
          y='2'
          width='22'
          height='40'
          rx='2'
          fill='rgba(0,0,0,0.45)'
          stroke='var(--aio-panel-border)'
          strokeWidth='1'
        />
        {/* tick marks (4 levels) */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1='4'
            y1={2 + 10 * (i + 1) - 0.5}
            x2='8'
            y2={2 + 10 * (i + 1) - 0.5}
            stroke='rgba(255,255,255,0.15)'
            strokeWidth='0.75'
          />
        ))}
        {/* water fill */}
        {upper !== null || lower !== null ? (
          <>
            <rect
              x='5'
              y={42 - fillH}
              width='20'
              height={fillH}
              fill='url(#tank-grad)'
              opacity='0.95'
            />
            {/* surface wave line */}
            <line
              x1='5'
              y1={42 - fillH}
              x2='25'
              y2={42 - fillH}
              stroke='#ecfeff'
              strokeWidth='0.8'
              opacity='0.6'
            />
          </>
        ) : null}
      </svg>
      <div className='flex flex-col gap-0.5 text-[9px] leading-tight'>
        <LevelLabel value={upper} label='상' />
        <LevelLabel value={lower} label='하' />
      </div>
    </div>
  )
}

function LevelLabel({ value, label }: { value: number | null; label: string }) {
  if (value === null) {
    return <span className='text-white/30'>{label} —</span>
  }
  return (
    <span>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span className='ml-0.5 text-white'>{value.toFixed(1)}</span>
      <span className='ml-0.5 text-[var(--aio-subtitle)]'>m</span>
    </span>
  )
}
