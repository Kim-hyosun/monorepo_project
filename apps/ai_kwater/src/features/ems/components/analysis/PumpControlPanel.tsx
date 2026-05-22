'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { AnalysisStation } from '@/features/ems/types/ems'

interface Props {
  pyeongtaek: AnalysisStation
  songsan: AnalysisStation
}

export function PumpControlPanel({ pyeongtaek, songsan }: Props) {
  const pyeongtaekCount = pyeongtaek.activePumps.filter(Boolean).length
  const songsanCount = songsan.activePumps.filter(Boolean).length
  const songsanFreq = songsan.freq.find((f) => f > 0) ?? 0

  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>송수 펌프 제어</h3>

      <div className='mb-3'>
        <div className='mb-1 text-xs text-[var(--aio-subtitle)]'>정수장 토출 관압</div>
        <div className='space-y-1 rounded border border-[var(--aio-panel-border)] bg-black/20 p-3'>
          <Row label='평택 관압' value={pyeongtaek.pressure.toFixed(2)} unit='kg/cm²' />
          <Row label='송산 관압' value={songsan.pressure.toFixed(2)} unit='kg/cm²' />
        </div>
      </div>

      <div>
        <div className='mb-1 text-xs text-[var(--aio-subtitle)]'>펌프 가동 대수</div>
        <div className='space-y-1 rounded border border-[var(--aio-panel-border)] bg-black/20 p-3'>
          <Row label='평택 펌프' value={String(pyeongtaekCount)} unit='대' />
          <Row
            label='송산 펌프'
            value={String(songsanCount)}
            unit={`대 (${songsanFreq.toFixed(2)} Hz)`}
          />
        </div>
      </div>
    </AioPanel>
  )
}

function Row({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className='flex items-baseline justify-between text-xs'>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span>
        <span className='text-sm font-semibold text-white'>{value}</span>
        <span className='ml-1 text-[var(--aio-subtitle)]'>{unit}</span>
      </span>
    </div>
  )
}
