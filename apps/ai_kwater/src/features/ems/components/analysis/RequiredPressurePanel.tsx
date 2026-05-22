'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { AnalysisRequiredPressure } from '@/features/ems/types/ems'

interface Props {
  required: AnalysisRequiredPressure
}

export function RequiredPressurePanel({ required }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>배수지 요구 관압</h3>
      <ul className='space-y-2 text-xs'>
        <Row label='최소요구관압 기준 배수지'>
          <span className='text-white' style={{ textShadow: 'var(--aio-text-glow)' }}>
            {required.baseReservoir.replace('_2', '#2')}
          </span>
        </Row>
        <Row label='최소요구관압 (분기점)'>
          <span className='text-white'>{required.branchPoint.toFixed(2)}</span>
          <span className='ml-1 text-[var(--aio-subtitle)]'>kg/cm²</span>
        </Row>
        <Row label='최소요구관압'>
          <span className='text-base font-semibold text-emerald-300'>
            {required.minPressure.toFixed(2)}
          </span>
          <span className='ml-1 text-[var(--aio-subtitle)]'>kg/cm²</span>
        </Row>
      </ul>
    </AioPanel>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className='flex items-center justify-between rounded border border-[var(--aio-panel-border)] bg-black/20 px-3 py-2'>
      <span className='text-[var(--aio-subtitle)]'>{label}</span>
      <span>{children}</span>
    </li>
  )
}
