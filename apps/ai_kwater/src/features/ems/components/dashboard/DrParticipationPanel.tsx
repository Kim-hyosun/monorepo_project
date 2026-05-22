'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import type { DrParticipation } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-xs text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

type Mode = 'dr' | 'peak'

interface Props {
  dr: DrParticipation
}

export function DrParticipationPanel({ dr }: Props) {
  const [mode, setMode] = useState<Mode>('dr')

  return (
    <AioPanel className='p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <a
          href='/peakControl'
          className='text-sm font-semibold text-white hover:underline'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          DR참여
        </a>
        <div className='flex gap-1'>
          <Tab active={mode === 'dr'} onClick={() => setMode('dr')}>
            DR 참여
          </Tab>
          <Tab active={mode === 'peak'} onClick={() => setMode('peak')}>
            피크 제어
          </Tab>
        </div>
      </div>

      {mode === 'dr' ? (
        <EmsLineChart
          series={[
            { name: 'DR Power', data: dr.drTrend, color: '#34d399' },
            { name: 'CBL', data: dr.cblTrend, color: '#fbbf24' },
            { name: 'AI', data: dr.aiTrend },
          ]}
          yLabel='kW'
          height={180}
        />
      ) : (
        <EmsLineChart
          series={[
            { name: 'Peak Power', data: dr.peakTrend },
            { name: 'AI', data: dr.aiTrend, color: '#34d399' },
          ]}
          yLabel='kW'
          height={180}
        />
      )}
    </AioPanel>
  )
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'rounded px-2 py-1 text-xs font-medium transition',
        active
          ? 'bg-[var(--aio-accent)]/30 text-white'
          : 'bg-white/5 text-white/70 hover:bg-white/10',
      )}
    >
      {children}
    </button>
  )
}
