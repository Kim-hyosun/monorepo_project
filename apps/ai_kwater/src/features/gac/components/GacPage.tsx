'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { GacLeftContents } from '@/features/gac/components/GacLeftContents'
import { GacRightContents } from '@/features/gac/components/GacRightContents'
import { ProcessHero } from '@/shared/components/ProcessHero'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  useGacLatestQuery,
  useUpdateGacBackwash,
  useUpdateGacOperation,
} from '@/features/gac/queries/gacQueries'
import { dialog } from '@/libs/dialog'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(() => import('@/features/receiving/components/TrendLineChart'), {
  ssr: false,
  loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div>,
})

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function GacPage() {
  const { data } = useGacLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateGacOperation()
  const { mutateAsync: updateBackwash, isPending } = useUpdateGacBackwash()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) setDraft(String(data.bw_interval ?? ''))
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
    const n = Number(draft)
    if (!Number.isFinite(n)) {
      await dialog.alert({ title: '경고', description: '숫자를 입력해주세요' })
      return
    }
    await updateBackwash({ bw_interval: n })
    await dialog.alert({ title: '저장 완료', description: 'GAC 역세 주기가 갱신됐습니다' })
    setIsModifyMode(false)
  }

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessHero cubeKey='gac' title='GAC 공정' subtitle='활성탄 / 손실 수두' />
      <ProcessPageHeader
        variant='dark'
        title='GAC — 알고리즘'
        mode={data.operation_mode}
        onModeChange={onModeChange}
        isModifyMode={isModifyMode}
        onModifyToggle={() => setIsModifyMode(!isModifyMode)}
        onSave={onSave}
        saveDisabled={isPending}
      />

      <GacLeftContents data={data} />
      <GacRightContents data={data} />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {isModifyMode ? (
          <div className='rounded-lg border border-[var(--aio-accent)]/50 bg-[var(--aio-panel)] p-4'>
            <div className='text-xs text-[var(--aio-subtitle)]'>역세 주기 (시간)</div>
            <Input
              className='mt-2 h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
        ) : (
          <KpiCard variant='dark' label='역세 주기' value={data.bw_interval} unit='시간' />
        )}
        <KpiCard
          variant='dark'
          highlight
          label='AI 역세 추천 주기'
          value={data.ai_bw_interval}
          unit='시간'
        />
        <KpiCard variant='dark' label='GAC 출구 탁도' value={data.g_out_tb} unit='NTU' />
        <KpiCard
          variant='dark'
          highlight
          label='AI 출구 탁도 예측'
          value={data.ai_g_out_tb}
          unit='NTU'
        />
        <KpiCard variant='dark' label='손실 수두' value={data.g_loss_head} unit='m' />
        <KpiCard
          variant='dark'
          highlight
          label='AI 손실 수두 예측'
          value={data.ai_g_loss_head}
          unit='m'
        />
        <KpiCard variant='dark' label='운영 중 GAC' value={data.g_running_count} unit='지' />
      </div>

      {data.ai_g_loss_head_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart
            dark
            data={data.ai_g_loss_head_trend}
            title='AI GAC 손실 수두 트렌드'
            yLabel='m'
          />
        </AioPanel>
      ) : null}
    </div>
  )
}
