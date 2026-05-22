'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { CoagulantsLeftContents } from '@/features/coagulants/components/CoagulantsLeftContents'
import { CoagulantsRightContents } from '@/features/coagulants/components/CoagulantsRightContents'
import { ProcessHero } from '@/shared/components/ProcessHero'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  useCoagulantsLatestQuery,
  useUpdateCoagulantsDosage,
  useUpdateCoagulantsOperation,
} from '@/features/coagulants/queries/coagulantsQueries'
import { dialog } from '@/libs/dialog'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(() => import('@/features/coagulants/components/TrendLineChart'), {
  ssr: false,
  loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div>,
})

interface Props {
  step: 3 | 4
}

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function CoagulantsPage({ step }: Props) {
  const { data } = useCoagulantsLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateCoagulantsOperation()
  const { mutateAsync: updateDosage, isPending } = useUpdateCoagulantsDosage()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draftDose, setDraftDose] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) {
      setDraftDose(String(data.cg_dose ?? ''))
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
    const dose = Number(draftDose)
    if (!Number.isFinite(dose)) {
      await dialog.alert({ title: '경고', description: '주입율에 숫자를 입력해주세요' })
      return
    }
    await updateDosage({ cg_dose: dose })
    await dialog.alert({ title: '저장 완료', description: '응집제 주입율이 갱신됐습니다' })
    setIsModifyMode(false)
  }

  const dose = step === 3 ? data.cg_dose : data.cg_dose_sc
  const aiDose = step === 3 ? data.ai_cg_dose : data.ai_cg_dose_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessHero cubeKey='coagulants' title='응집 공정' subtitle='응집제 주입율 / cgSimulation' />
      <ProcessPageHeader
        variant='dark'
        title={`응집 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/cgAlgorithm', fourPath: '/cgAlgorithmS' }}
        mode={data.operation_mode}
        onModeChange={onModeChange}
        isModifyMode={isModifyMode}
        onModifyToggle={() => setIsModifyMode(!isModifyMode)}
        onSave={onSave}
        saveDisabled={isPending}
      />

      <CoagulantsLeftContents data={data} />
      <CoagulantsRightContents data={data} />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {isModifyMode ? (
          <div className='rounded-lg border border-[var(--aio-accent)]/50 bg-[var(--aio-panel)] p-4'>
            <div className='text-xs text-[var(--aio-subtitle)]'>응집제 주입율 (mg/L)</div>
            <Input
              className='mt-2 h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
              value={draftDose}
              onChange={(e) => setDraftDose(e.target.value)}
            />
          </div>
        ) : (
          <KpiCard variant='dark' label='응집제 주입율' value={dose} unit='mg/L' />
        )}
        <KpiCard variant='dark' highlight label='AI 응집제 주입율' value={aiDose} unit='mg/L' />
        <KpiCard
          variant='dark'
          highlight
          label='AI 추천값'
          value={data.recommend_cg_dose}
          unit='mg/L'
        />
        <KpiCard variant='dark' label='응집제 농도' value={data.cg_density} unit='%' />
        <KpiCard variant='dark' label='유입 탁도' value={data.in_tb} unit='NTU' />
      </div>

      {data.ai_cg_dose_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart
            dark
            data={data.ai_cg_dose_trend}
            title='AI 응집제 주입율 트렌드'
            yLabel='mg/L'
          />
        </AioPanel>
      ) : null}
    </div>
  )
}
