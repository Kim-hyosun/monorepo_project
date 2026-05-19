'use client'

import dynamic from 'next/dynamic'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import {
  useDisinfectionLatestQuery,
  useUpdateDisinfectionOperation,
} from '@/features/disinfection/queries/disinfectionQueries'
import type { DisinfectionStage } from '@/features/disinfection/types/disinfection'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(
  () => import('@/features/receiving/components/TrendLineChart'),
  { ssr: false, loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div> },
)

interface Props {
  step: 3 | 4
}

const STAGE_LABELS: Record<'pre' | 'mid' | 'after', string> = {
  pre: '전염소',
  mid: '중염소',
  after: '후염소',
}

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function DisinfectionPage({ step }: Props) {
  const { data } = useDisinfectionLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateDisinfectionOperation()

  if (!data) {
    return (
      <div className='-m-6 min-h-screen p-6 text-[var(--aio-subtitle)]' style={DARK_WRAPPER_STYLE}>
        로딩 중…
      </div>
    )
  }

  const onModeChange = (mode: OperationMode) => updateOperation({ operation_mode: mode })
  const stages = step === 3 ? data.stages : data.stages_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessPageHeader
        variant='dark'
        title={`소독 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/disinfectionAlgorithm', fourPath: '/disinfectionAlgorithmS' }}
        mode={data.operation_mode}
        onModeChange={onModeChange}
      />

      {(['pre', 'mid', 'after'] as const).map((s) => (
        <StageSection key={s} label={STAGE_LABELS[s]} stage={stages[s]} />
      ))}

      {data.ai_cl_dose_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart dark data={data.ai_cl_dose_trend} title='AI 후염소 주입율 트렌드' yLabel='mg/L' />
        </AioPanel>
      ) : null}
    </div>
  )
}

function StageSection({ label, stage }: { label: string; stage: DisinfectionStage }) {
  return (
    <div className='space-y-2'>
      <h3
        className='text-sm font-semibold text-[var(--aio-subtitle)]'
        style={{ textShadow: 'var(--aio-text-glow)' }}
      >
        {label}
      </h3>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <KpiCard variant='dark' label='잔류 염소' value={stage.cl_residual} unit='mg/L' />
        <KpiCard variant='dark' highlight label='AI 잔류 염소 예측' value={stage.ai_cl_residual} unit='mg/L' />
        <KpiCard variant='dark' label='염소 주입율' value={stage.cl_dose} unit='mg/L' />
        <KpiCard variant='dark' highlight label='AI 추천 주입율' value={stage.ai_cl_dose} unit='mg/L' />
      </div>
    </div>
  )
}
