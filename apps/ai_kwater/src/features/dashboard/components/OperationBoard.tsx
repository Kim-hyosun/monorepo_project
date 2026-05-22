'use client'

import { useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { ModeToggleBar, type OperationMode } from '@/shared/components/ModeToggleBar'
import { cn } from '@/shared/utils/cn'
import {
  useCoagulantsLatestQuery,
  useUpdateCoagulantsOperation,
} from '@/features/coagulants/queries/coagulantsQueries'
import {
  useDisinfectionLatestQuery,
  useUpdateDisinfectionOperation,
} from '@/features/disinfection/queries/disinfectionQueries'
import {
  useFilterLatestQuery,
  useUpdateFilterOperation,
} from '@/features/filter/queries/filterQueries'
import { useGacLatestQuery, useUpdateGacOperation } from '@/features/gac/queries/gacQueries'
import {
  useMixingLatestQuery,
  useUpdateMixingOperation,
} from '@/features/mixing/queries/mixingQueries'
import { useOzoneLatestQuery, useUpdateOzoneOperation } from '@/features/ozone/queries/ozoneQueries'
import {
  useReceivingLatestQuery,
  useUpdateReceivingOperation,
} from '@/features/receiving/queries/receivingQueries'
import {
  useSedimentationLatestQuery,
  useUpdateSedimentationOperation,
} from '@/features/sedimentation/queries/sedimentationQueries'

interface ProcessRow {
  name: string
  mode: OperationMode | null
  onModeChange: (mode: OperationMode) => void
  kpiThree: { label: string; value: number | null | undefined; unit?: string }
  kpiFour: { label: string; value: number | null | undefined; unit?: string }
}

export function OperationBoard() {
  const { data: receiving } = useReceivingLatestQuery()
  const { data: coagulants } = useCoagulantsLatestQuery()
  const { data: mixing } = useMixingLatestQuery()
  const { data: sedimentation } = useSedimentationLatestQuery()
  const { data: filter } = useFilterLatestQuery()
  const { data: gac } = useGacLatestQuery()
  const { data: ozone } = useOzoneLatestQuery()
  const { data: disinfection } = useDisinfectionLatestQuery()

  const { mutateAsync: updateReceiving } = useUpdateReceivingOperation()
  const { mutateAsync: updateCoagulants } = useUpdateCoagulantsOperation()
  const { mutateAsync: updateMixing } = useUpdateMixingOperation()
  const { mutateAsync: updateSedimentation } = useUpdateSedimentationOperation()
  const { mutateAsync: updateFilter } = useUpdateFilterOperation()
  const { mutateAsync: updateGac } = useUpdateGacOperation()
  const { mutateAsync: updateOzone } = useUpdateOzoneOperation()
  const { mutateAsync: updateDisinfection } = useUpdateDisinfectionOperation()

  const rows: ProcessRow[] = [
    {
      name: '착수',
      mode: receiving?.operation_mode ?? null,
      onModeChange: (m) => updateReceiving({ operation_mode: m }),
      kpiThree: { label: '원수 유입', value: receiving?.b_in_fr_i, unit: 'm³/h' },
      kpiFour: { label: '원수 유입', value: receiving?.b_in_fr_i_sc, unit: 'm³/h' },
    },
    {
      name: '응집',
      mode: coagulants?.operation_mode ?? null,
      onModeChange: (m) => updateCoagulants({ operation_mode: m }),
      kpiThree: { label: '주입율', value: coagulants?.cg_dose, unit: 'mg/L' },
      kpiFour: { label: '주입율', value: coagulants?.cg_dose_sc, unit: 'mg/L' },
    },
    {
      name: '혼화',
      mode: mixing?.operation_mode ?? null,
      onModeChange: (m) => updateMixing({ operation_mode: m }),
      kpiThree: { label: 'G값', value: mixing?.g_value, unit: 's⁻¹' },
      kpiFour: { label: 'G값', value: mixing?.g_value_sc, unit: 's⁻¹' },
    },
    {
      name: '침전',
      mode: sedimentation?.operation_mode ?? null,
      onModeChange: (m) => updateSedimentation({ operation_mode: m }),
      kpiThree: { label: '출구 탁도', value: sedimentation?.e_out_tb, unit: 'NTU' },
      kpiFour: { label: '출구 탁도', value: sedimentation?.e_out_tb_sc, unit: 'NTU' },
    },
    {
      name: '여과',
      mode: filter?.operation_mode ?? null,
      onModeChange: (m) => updateFilter({ operation_mode: m }),
      kpiThree: { label: '손실 수두', value: filter?.f_loss_head, unit: 'm' },
      kpiFour: { label: '손실 수두', value: filter?.f_loss_head_sc, unit: 'm' },
    },
    {
      name: 'GAC',
      mode: gac?.operation_mode ?? null,
      onModeChange: (m) => updateGac({ operation_mode: m }),
      kpiThree: { label: '손실 수두', value: gac?.g_loss_head, unit: 'm' },
      kpiFour: { label: '손실 수두', value: gac?.g_loss_head, unit: 'm' },
    },
    {
      name: '오존',
      mode: ozone?.operation_mode ?? null,
      onModeChange: (m) => updateOzone({ operation_mode: m }),
      kpiThree: { label: '주입율', value: ozone?.oz_dose, unit: 'mg/L' },
      kpiFour: { label: '주입율', value: ozone?.oz_dose, unit: 'mg/L' },
    },
    {
      name: '소독',
      mode: disinfection?.operation_mode ?? null,
      onModeChange: (m) => updateDisinfection({ operation_mode: m }),
      kpiThree: {
        label: '후염소 주입율',
        value: disinfection?.stages.after.cl_dose,
        unit: 'mg/L',
      },
      kpiFour: {
        label: '후염소 주입율',
        value: disinfection?.stages_sc.after.cl_dose,
        unit: 'mg/L',
      },
    },
  ]

  return <OperationBoardView rows={rows} />
}

type Stage = '3' | '4'
const STAGE_TABS: Array<{ key: Stage; label: string }> = [
  { key: '3', label: '자율운영 3단계' },
  { key: '4', label: '자율운영 4단계' },
]

function OperationBoardView({ rows }: { rows: ProcessRow[] }) {
  const [stage, setStage] = useState<Stage>('3')
  return (
    <div
      className='-m-6 min-h-screen space-y-6 p-6 text-white'
      style={{
        background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
      }}
    >
      <AioPageHeader title='AI 자율운영 주요감시현황' center />

      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {STAGE_TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setStage(t.key)}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition',
              stage === t.key
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
            style={stage === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Column title={stage === '3' ? '자율운영 3단계' : '자율운영 4단계'}>
        {rows.map((row) => (
          <ProcessCard
            key={`${stage}-${row.name}`}
            name={row.name}
            mode={row.mode}
            onModeChange={row.onModeChange}
            metric={stage === '3' ? row.kpiThree : row.kpiFour}
          />
        ))}
      </Column>
    </div>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='space-y-3'>
      <div
        className='rounded-md px-6 py-2 text-center text-lg font-semibold text-white'
        style={{
          backgroundImage: 'var(--aio-divider-gradient)',
          textShadow: 'var(--aio-text-glow)',
        }}
      >
        {title}
      </div>
      <div className='space-y-2'>{children}</div>
    </section>
  )
}

interface ProcessCardProps {
  name: string
  mode: OperationMode | null
  onModeChange: (mode: OperationMode) => void
  metric: { label: string; value: number | null | undefined; unit?: string }
}

function ProcessCard({ name, mode, onModeChange, metric }: ProcessCardProps) {
  return (
    <AioPanel className='flex items-center justify-between gap-3 p-3'>
      <div className='flex-1'>
        <div
          className='text-base font-semibold text-[var(--aio-subtitle)]'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          {name}
        </div>
        <div className='mt-0.5 flex items-baseline gap-1'>
          <span className='text-xs text-[var(--aio-subtitle)]'>{metric.label}</span>
          <span className='text-sm font-semibold text-white'>{metric.value ?? '-'}</span>
          {metric.unit ? (
            <span className='text-[10px] text-[var(--aio-subtitle)]'>{metric.unit}</span>
          ) : null}
        </div>
      </div>
      <ModeToggleBar value={mode} onChange={onModeChange} />
    </AioPanel>
  )
}
