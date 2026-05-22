'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SongsuPipeFlow } from '@/features/ems/types/ems'

interface Props {
  pipe: SongsuPipeFlow
}

export function PipeFlowDiagram({ pipe }: Props) {
  return (
    <AioPanel className='p-4'>
      <style>{`
        @keyframes wf-pipe-dash {
          to { stroke-dashoffset: -40; }
        }
      `}</style>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>파이프 라인</h3>
      <svg viewBox='0 0 600 120' className='h-32 w-full'>
        <defs>
          <linearGradient id='pipe-blue' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#5cafff' stopOpacity='0.2' />
            <stop offset='50%' stopColor='#5cafff' stopOpacity='1' />
            <stop offset='100%' stopColor='#5cafff' stopOpacity='0.2' />
          </linearGradient>
          <linearGradient id='pipe-green' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#34d399' stopOpacity='0.2' />
            <stop offset='50%' stopColor='#34d399' stopOpacity='1' />
            <stop offset='100%' stopColor='#34d399' stopOpacity='0.2' />
          </linearGradient>
        </defs>

        <text x='30' y='35' fill='#c3eaff' fontSize='11'>
          평택
        </text>
        <line x1='60' y1='30' x2='560' y2='30' stroke='#5cafff44' strokeWidth='12' />
        <line
          x1='60'
          y1='30'
          x2='560'
          y2='30'
          stroke='url(#pipe-blue)'
          strokeWidth='6'
          strokeDasharray='20 20'
          opacity={pipe.pyeongtaekFlow}
          style={{ animation: 'wf-pipe-dash 2s linear infinite' }}
        />
        <circle cx='560' cy='30' r='6' fill='#5cafff' opacity={pipe.pyeongtaekFlow} />

        <text x='30' y='95' fill='#c3eaff' fontSize='11'>
          송산
        </text>
        <line x1='60' y1='90' x2='560' y2='90' stroke='#34d39944' strokeWidth='12' />
        <line
          x1='60'
          y1='90'
          x2='560'
          y2='90'
          stroke='url(#pipe-green)'
          strokeWidth='6'
          strokeDasharray='20 20'
          opacity={pipe.songsanFlow}
          style={{ animation: 'wf-pipe-dash 2.5s linear infinite' }}
        />
        <circle cx='560' cy='90' r='6' fill='#34d399' opacity={pipe.songsanFlow} />
      </svg>
      <div className='mt-2 flex justify-between text-xs text-[var(--aio-subtitle)]'>
        <span>유량 강도 — 평택 {Math.round(pipe.pyeongtaekFlow * 100)}%</span>
        <span>송산 {Math.round(pipe.songsanFlow * 100)}%</span>
      </div>
    </AioPanel>
  )
}
