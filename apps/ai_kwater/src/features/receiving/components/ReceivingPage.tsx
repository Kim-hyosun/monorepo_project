'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessHero } from '@/shared/components/ProcessHero'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { ReceivingLeftContents } from '@/features/receiving/components/ReceivingLeftContents'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  useReceivingLatestQuery,
  useUpdateReceivingLevel,
  useUpdateReceivingOperation,
} from '@/features/receiving/queries/receivingQueries'
import { dialog } from '@/libs/dialog'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(() => import('@/features/receiving/components/TrendLineChart'), {
  ssr: false,
  loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div>,
})
const ReceivingHighchart = dynamic(() => import('@/shared/components/charts/ReceivingHighchart'), {
  ssr: false,
  loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div>,
})

interface Props {
  step: 3 | 4
}

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function ReceivingPage({ step }: Props) {
  const { data } = useReceivingLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateReceivingOperation()
  const { mutateAsync: updateLevel, isPending } = useUpdateReceivingLevel()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draftMax, setDraftMax] = useState('')
  const [draftMin, setDraftMin] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) {
      setDraftMax(String(data.h_target_le_max ?? ''))
      setDraftMin(String(data.h_target_le_min ?? ''))
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
    const max = Number(draftMax)
    const min = Number(draftMin)
    if (!Number.isFinite(max) || !Number.isFinite(min)) {
      await dialog.alert({ title: '경고', description: '목표 수위에 숫자를 입력해주세요' })
      return
    }
    await updateLevel({ h_target_le_max: max, h_target_le_min: min })
    await dialog.alert({ title: '저장 완료', description: '목표 수위가 갱신됐습니다' })
    setIsModifyMode(false)
  }

  const inflow = step === 3 ? data.b_in_fr_i : data.b_in_fr_i_sc
  const valve = step === 3 ? data.b1_vv_po : data.b1_vv_po_sc
  const level = step === 3 ? data.h_location_le1 : data.h_location_le1_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessHero
        cubeKey='receiving'
        title='착수 공정'
        subtitle='원수 유입 / 정수지 수위 모니터링'
      />
      <ProcessPageHeader
        variant='dark'
        title={`착수 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/receivingAlgorithm', fourPath: '/receivingAlgorithmS' }}
        mode={data.operation_mode}
        onModeChange={onModeChange}
        isModifyMode={isModifyMode}
        onModifyToggle={() => setIsModifyMode(!isModifyMode)}
        onSave={onSave}
        saveDisabled={isPending}
      />

      <ReceivingLeftContents data={data} />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {isModifyMode ? (
          <>
            <DarkModifyField
              label='정수지 최대 목표 수위 (m)'
              value={draftMax}
              onChange={setDraftMax}
            />
            <DarkModifyField
              label='정수지 최소 목표 수위 (m)'
              value={draftMin}
              onChange={setDraftMin}
            />
          </>
        ) : (
          <>
            <KpiCard
              variant='dark'
              label='정수지 최대 목표'
              value={data.h_target_le_max}
              unit='m'
            />
            <KpiCard
              variant='dark'
              label='정수지 최소 목표'
              value={data.h_target_le_min}
              unit='m'
            />
          </>
        )}
        <KpiCard variant='dark' label='원수 유입 유량' value={inflow} unit='m³/h' />
        <KpiCard variant='dark' label='1차 원수 조절 밸브' value={valve} unit='%' />
        <KpiCard variant='dark' label='정수지#1 수위' value={level} unit='m' />
        <KpiCard
          variant='dark'
          highlight
          label='AI 정수지 유입 예측'
          value={data.ai_b1_in_fr}
          unit='m³/h'
        />
      </div>

      {data.ai_b_in_fr_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart
            dark
            data={data.ai_b_in_fr_trend}
            title='원수 유입 유량 트렌드'
            yLabel='m³/h'
          />
        </AioPanel>
      ) : null}

      {data.ai_b_in_fr_trend ? (
        <AioPanel className='p-4'>
          <ReceivingHighchart
            inflowTrend={data.ai_b_in_fr_trend}
            aiPredictTrend={data.ai_b_in_fr_trend.map(([t, v]) => [t, v * 1.05])}
            targetRange={{
              min: typeof data.h_target_le_min === 'number' ? data.h_target_le_min * 700 : 3000,
              max: typeof data.h_target_le_max === 'number' ? data.h_target_le_max * 700 : 4500,
            }}
          />
        </AioPanel>
      ) : null}
    </div>
  )
}

function DarkModifyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
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
