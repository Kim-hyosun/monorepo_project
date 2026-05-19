'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  useSedimentationLatestQuery,
  useUpdateSedimentationOperation,
  useUpdateSedimentationSettings,
} from '@/features/sedimentation/queries/sedimentationQueries'
import { dialog } from '@/libs/dialog'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(
  () => import('@/features/receiving/components/TrendLineChart'),
  { ssr: false, loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div> },
)

interface Props {
  step: 3 | 4
}

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function SedimentationPage({ step }: Props) {
  const { data } = useSedimentationLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateSedimentationOperation()
  const { mutateAsync: updateSettings, isPending } = useUpdateSedimentationSettings()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draftTime, setDraftTime] = useState('')
  const [draftPurge, setDraftPurge] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) {
      setDraftTime(String(data.sd_time ?? ''))
      setDraftPurge(String(data.sd_purge_interval ?? ''))
    }
  }, [data, isModifyMode])

  if (!data) {
    return (
      <div className='-m-6 min-h-screen p-6 text-[var(--aio-subtitle)]' style={DARK_WRAPPER_STYLE}>
        로딩 중…
      </div>
    )
  }

  const onModeChange = (mode: OperationMode) => updateOperation({ operation_mode: mode })
  const onSave = async () => {
    const t = Number(draftTime)
    const p = Number(draftPurge)
    if (!Number.isFinite(t) || !Number.isFinite(p)) {
      await dialog.alert({ title: '경고', description: '숫자를 입력해주세요' })
      return
    }
    await updateSettings({ sd_time: t, sd_purge_interval: p })
    await dialog.alert({ title: '저장 완료', description: '침전 설정이 갱신됐습니다' })
    setIsModifyMode(false)
  }

  const turbidity = step === 3 ? data.e_out_tb : data.e_out_tb_sc
  const aiTurbidity = step === 3 ? data.ai_e_out_tb : data.ai_e_out_tb_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessPageHeader
        variant='dark'
        title={`침전 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/sedimentationAlgorithm', fourPath: '/sedimentationAlgorithmS' }}
        mode={data.operation_mode}
        onModeChange={onModeChange}
        isModifyMode={isModifyMode}
        onModifyToggle={() => setIsModifyMode(!isModifyMode)}
        onSave={onSave}
        saveDisabled={isPending}
      />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {isModifyMode ? (
          <>
            <DarkModifyField label='침전 시간 (분)' value={draftTime} onChange={setDraftTime} />
            <DarkModifyField label='슬러지 배출 주기 (분)' value={draftPurge} onChange={setDraftPurge} />
          </>
        ) : (
          <>
            <KpiCard variant='dark' label='침전 시간' value={data.sd_time} unit='분' />
            <KpiCard variant='dark' label='슬러지 배출 주기' value={data.sd_purge_interval} unit='분' />
          </>
        )}
        <KpiCard variant='dark' label='침전지 출구 탁도' value={turbidity} unit='NTU' />
        <KpiCard variant='dark' highlight label='AI 출구 탁도 예측' value={aiTurbidity} unit='NTU' />
        <KpiCard variant='dark' label='슬러지 농도' value={data.sd_density} unit='%' />
        <KpiCard variant='dark' highlight label='AI 슬러지 배출 추천' value={data.ai_sd_purge_interval} unit='분' />
      </div>

      {data.ai_e_out_tb_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart dark data={data.ai_e_out_tb_trend} title='침전지 출구 탁도 트렌드' yLabel='NTU' />
        </AioPanel>
      ) : null}
    </div>
  )
}

function DarkModifyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className='rounded-lg border border-[var(--aio-accent)]/50 bg-[var(--aio-panel)] p-4'>
      <div className='text-xs text-[var(--aio-subtitle)]'>{label}</div>
      <Input
        className='mt-2 h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
