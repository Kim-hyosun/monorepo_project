'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { AnalysisAiSuggestion } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  pyeongtaekAi: AnalysisAiSuggestion
  songsanAi: AnalysisAiSuggestion
}

export function AnalysisResultPanel({ pyeongtaekAi, songsanAi }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>분석 결과 (AI 추천)</h3>
      <AiStation label='평택' suggestion={pyeongtaekAi} pumpCount={4} />
      <div className='my-3 h-px bg-[var(--aio-panel-border)]' />
      <AiStation label='송산' suggestion={songsanAi} pumpCount={2} showFreq />
    </AioPanel>
  )
}

function AiStation({
  label,
  suggestion,
  pumpCount,
  showFreq,
}: {
  label: string
  suggestion: AnalysisAiSuggestion
  pumpCount: number
  showFreq?: boolean
}) {
  return (
    <div>
      <div className='mb-2 flex items-center gap-3'>
        <span
          className='flex h-8 min-w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2 text-sm font-semibold text-emerald-300'
          style={{ textShadow: '0 0 6px #34d39988' }}
        >
          {label}
        </span>
        <div className='flex flex-1 flex-col gap-1'>
          <Metric label='관압' value={suggestion.pressure.toFixed(1)} unit='kg/cm²' />
          <Metric label='유량' value={suggestion.flow.toFixed(1)} unit='m³' />
        </div>
      </div>
      <div className={cn('grid gap-2', pumpCount === 4 ? 'grid-cols-4' : 'grid-cols-2')}>
        {Array.from({ length: pumpCount }).map((_, i) => {
          const on = suggestion.pumps[i] ?? false
          return (
            <div
              key={i}
              className={cn(
                'flex h-12 items-center justify-center rounded border text-sm font-semibold',
                on
                  ? 'border-emerald-300 bg-emerald-400/20 text-emerald-100'
                  : 'border-white/10 bg-black/30 text-white/40',
              )}
              style={on ? { textShadow: '0 0 8px #34d399' } : undefined}
            >
              #{i + 1}
              {on ? <span className='ml-1 text-xs text-emerald-300'>AI</span> : null}
            </div>
          )
        })}
      </div>
      {showFreq ? (
        <div className='mt-2 grid grid-cols-2 gap-2'>
          {suggestion.freq.map((f, i) => (
            <div
              key={i}
              className='rounded border border-emerald-300/40 bg-emerald-400/10 px-2 py-1 text-center text-xs text-emerald-200'
            >
              <span className='font-semibold'>{f.toFixed(2)}</span>
              <span className='ml-1 text-[var(--aio-subtitle)]'>Hz</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className='flex items-baseline justify-between text-xs'>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span>
        <span className='text-base font-semibold text-emerald-300'>{value}</span>
        <span className='ml-1 text-[var(--aio-subtitle)]'>{unit}</span>
      </span>
    </div>
  )
}
