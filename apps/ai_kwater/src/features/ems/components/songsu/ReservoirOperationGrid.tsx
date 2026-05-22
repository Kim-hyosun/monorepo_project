'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SongsuReservoir, SongsuReservoirLine, SongsuValve } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  reservoirs: SongsuReservoir[]
}

const LINE_LABELS = ['①', '②', '③', '④']

/**
 * 11 배수지 펌프 운영현황 — 원본 픽셀매칭에 가까운 노드 layout.
 * 단일 line: [배수지 카드] → 유입 pipe → 밸브-IN 2 → 수위 탱크 → 밸브-OUT 2 → 유출 pipe
 * multi-line: 같은 배수지의 라인2/3/4는 사용자 라인 indicator(①②③) 와 함께 줄단위로 stacked.
 */
export function ReservoirOperationGrid({ reservoirs }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>펌프 운영현황</h3>
      <div className='space-y-2'>
        {reservoirs.map((r) => (
          <ReservoirRow key={r.name} reservoir={r} />
        ))}
      </div>
    </AioPanel>
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
    <div className='flex w-24 shrink-0 flex-col justify-center rounded border border-[var(--aio-accent)]/30 bg-[var(--aio-accent)]/10 p-2 text-center'>
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
      {showLineIndicator ? (
        <span className='w-5 shrink-0 text-center text-[10px] text-[var(--aio-subtitle)]'>
          {LINE_LABELS[lineIndex] ?? `L${lineIndex + 1}`}
        </span>
      ) : null}

      <FlowSegment value={line.inflow} unit='m³/h' direction='right' />
      <ValvePair valves={line.valvesIn} />
      <WaterTank levels={line.waterLevels} />
      <ValvePair valves={line.valvesOut} />
      <FlowSegment value={line.outflow} unit='m³/h' direction='right' />
    </div>
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
      <div
        className={cn(
          'relative h-1.5 flex-1 overflow-hidden rounded-full',
          active ? 'bg-[var(--aio-accent)]/30' : 'bg-white/10',
        )}
      >
        {active ? (
          <span
            className='absolute inset-y-0 h-1.5 w-1/3 rounded-full bg-[var(--aio-accent)]'
            style={{
              animation: `wf-pipe-flow 2.4s linear infinite`,
              animationDirection: direction === 'left' ? 'reverse' : 'normal',
            }}
          />
        ) : null}
        <style>{`
          @keyframes wf-pipe-flow {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
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
  if (!valve) {
    return (
      <span className='inline-block h-7 w-7 rounded-full border border-white/10 text-center text-[10px] leading-7 text-white/30'>
        —
      </span>
    )
  }
  const on = valve.state === 'on'
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full border text-[9px] font-medium leading-none',
        on
          ? 'border-emerald-300 bg-emerald-400/30 text-emerald-100'
          : 'border-white/20 bg-black/40 text-white/40',
      )}
      style={on ? { boxShadow: '0 0 8px rgba(110,231,183,0.5)' } : undefined}
      title={`${valve.state.toUpperCase()} · ${valve.opening.toFixed(0)}%`}
    >
      {on ? `${valve.opening.toFixed(0)}` : 'OFF'}
    </span>
  )
}

function WaterTank({ levels }: { levels: [number | null, number | null] }) {
  const [upper, lower] = levels
  const total = (upper ?? 0) + (lower ?? 0)
  const ratio = total > 0 ? ((upper ?? 0) / total) * 100 : 0
  return (
    <div className='flex shrink-0 items-end gap-1'>
      <div className='relative h-9 w-7 overflow-hidden rounded-sm border border-[var(--aio-panel-border)] bg-black/40'>
        {upper !== null || lower !== null ? (
          <span
            className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--aio-accent)] to-[var(--aio-accent)]/40'
            style={{ height: `${Math.min(100, Math.max(10, ratio))}%` }}
          />
        ) : null}
      </div>
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
