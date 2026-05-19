'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  useMixingLatestQuery,
  useUpdateMixingMtcc,
  useUpdateMixingOperation,
} from '@/features/mixing/queries/mixingQueries'
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

export function MtccPage({ step }: Props) {
  const { data } = useMixingLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateMixingOperation()
  const { mutateAsync: updateMtcc, isPending } = useUpdateMixingMtcc()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draftG, setDraftG] = useState('')
  const [draftTime, setDraftTime] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) {
      setDraftG(String(data.g_value ?? ''))
      setDraftTime(String(data.mtcc_time ?? ''))
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
    const g = Number(draftG)
    const t = Number(draftTime)
    if (!Number.isFinite(g) || !Number.isFinite(t)) {
      await dialog.alert({ title: '경고', description: '숫자를 입력해주세요' })
      return
    }
    await updateMtcc({ g_value: g, mtcc_time: t })
    await dialog.alert({ title: '저장 완료', description: '혼화 설정이 갱신됐습니다' })
    setIsModifyMode(false)
  }

  const g = step === 3 ? data.g_value : data.g_value_sc
  const aiG = step === 3 ? data.ai_g_value : data.ai_g_value_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessPageHeader
        variant='dark'
        title={`혼화 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/mtccAlgorithm', fourPath: '/mtccAlgorithmS' }}
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
            <DarkModifyField label='G값 (s⁻¹)' value={draftG} onChange={setDraftG} />
            <DarkModifyField label='응집 시간 (분)' value={draftTime} onChange={setDraftTime} />
          </>
        ) : (
          <>
            <KpiCard variant='dark' label='혼화 G값' value={g} unit='s⁻¹' />
            <KpiCard variant='dark' label='응집 시간' value={data.mtcc_time} unit='분' />
          </>
        )}
        <KpiCard variant='dark' highlight label='AI G값' value={aiG} unit='s⁻¹' />
        <KpiCard variant='dark' label='혼화기 RPM' value={data.mixer_rpm} unit='rpm' />
        <KpiCard variant='dark' highlight label='AI 혼화기 RPM' value={data.ai_mixer_rpm} unit='rpm' />
      </div>

      {data.ai_g_value_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart dark data={data.ai_g_value_trend} title='AI G값 트렌드' yLabel='s⁻¹' />
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
