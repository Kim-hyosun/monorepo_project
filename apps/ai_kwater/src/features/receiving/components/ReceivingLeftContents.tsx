'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { ReceivingLatest } from '@/features/receiving/types/receiving'

interface Props {
  data: ReceivingLatest
}

/**
 * 원본 성남정수장/components/aio/receiving/ReceivingLeftContents.vue (1209줄) 의
 * value-contents + img-contents 핵심 블록 부분 복원.
 * - 좌측: 3 value (유입 유량 순시 / 적산 / 유입 압력)
 * - 우측: 4 valve box (1차/2차 원수 조절 밸브 / 가이드 베인 / 바이패스)
 * - 중앙 화살표 흐름 애니메이션
 */
export function ReceivingLeftContents({ data }: Props) {
  const bInFrI = num(data.b_in_fr_i)
  const bInFrQ = num(data.b_in_fr_q)
  const bInPr = num(data.b_in_pr)
  const v1 = num(data.b1_vv_po)
  const v2 = num(data.b2_vv_po)
  const gd = num(data.gd_vn_vv)
  const bypass = num(data.by_pa_vv)

  return (
    <AioPanel className='relative overflow-hidden p-4'>
      <style>{`
        @keyframes rcv-arrow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
      <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
        {/* 좌측 — 3 value */}
        <div className='space-y-2'>
          <ValueBox title='원수 유입 유량 순시' value={bInFrI} unit='m³/h' />
          <ValueBox title='원수 유입 유량 적산' value={bInFrQ} unit='m³' small />
          <ValueBox title='원수 유입 압력' value={bInPr} unit='kgf/cm²' digits={2} />
        </div>

        {/* 중앙 — flow arrow */}
        <div className='flex h-full min-h-[120px] w-32 items-center justify-center'>
          <div className='relative h-3 w-full overflow-hidden rounded-full bg-[var(--aio-accent)]/15'>
            <span
              className='absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--aio-accent)] to-transparent'
              style={{ animation: 'rcv-arrow 2.2s linear infinite' }}
            />
            <span
              className='absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[var(--aio-accent)]/70 to-transparent'
              style={{ animation: 'rcv-arrow 2.2s linear 0.7s infinite' }}
            />
          </div>
        </div>

        {/* 우측 — 4 valve */}
        <div className='grid grid-cols-2 gap-2'>
          <ValveBox label='1차 원수 조절 밸브' value={v1} />
          <ValveBox label='2차 원수 조절 밸브' value={v2} />
          <ValveBox label='가이드 베인 밸브' value={gd} />
          <ValveBox label='바이패스 밸브' value={bypass} />
        </div>
      </div>
    </AioPanel>
  )
}

function num(v: ReceivingLatest[keyof ReceivingLatest]): number | null {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function ValueBox({
  title,
  value,
  unit,
  digits = 1,
  small,
}: {
  title: string
  value: number | null
  unit: string
  digits?: number
  small?: boolean
}) {
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
      <div className='text-[10px] tracking-wide text-[var(--aio-subtitle)]'>{title}</div>
      <div className='mt-1 flex items-baseline gap-1'>
        <span
          className={small ? 'text-xl font-semibold text-white' : 'text-2xl font-bold text-white'}
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {value === null
            ? '—'
            : value.toLocaleString(undefined, { maximumFractionDigits: digits })}
        </span>
        <span className='text-[10px] text-[var(--aio-subtitle)]'>{unit}</span>
      </div>
    </div>
  )
}

function ValveBox({ label, value }: { label: string; value: number | null }) {
  const active = value !== null && value > 0
  return (
    <div
      className={`rounded-md border p-2 ${
        active
          ? 'border-emerald-300/40 bg-emerald-500/5'
          : 'border-[var(--aio-panel-border)] bg-black/30'
      }`}
    >
      <div className='text-[10px] text-[var(--aio-subtitle)]'>{label}</div>
      <div className='mt-1 flex items-baseline justify-between gap-1'>
        <span
          className={`text-lg font-semibold ${active ? 'text-emerald-200' : 'text-white/60'}`}
          style={active ? { textShadow: '0 0 8px rgba(110,231,183,0.45)' } : undefined}
        >
          {value === null ? '—' : value.toFixed(0)}
        </span>
        <span className='text-[10px] text-[var(--aio-subtitle)]'>%</span>
      </div>
    </div>
  )
}
