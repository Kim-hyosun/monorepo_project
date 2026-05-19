'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { Input } from '@/shared/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  useFilterLatestQuery,
  useUpdateFilterBackwash,
  useUpdateFilterOperation,
} from '@/features/filter/queries/filterQueries'
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

function formatTime(ts: string | null): string {
  if (!ts) return '-'
  const d = new Date(ts)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function FilterPage({ step }: Props) {
  const { data } = useFilterLatestQuery()
  const { mutateAsync: updateOperation } = useUpdateFilterOperation()
  const { mutateAsync: updateBackwash, isPending } = useUpdateFilterBackwash()

  const [isModifyMode, setIsModifyMode] = useState(false)
  const [draftInterval, setDraftInterval] = useState('')

  useEffect(() => {
    if (data && !isModifyMode) setDraftInterval(String(data.bw_interval ?? ''))
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
    const n = Number(draftInterval)
    if (!Number.isFinite(n)) {
      await dialog.alert({ title: '경고', description: '숫자를 입력해주세요' })
      return
    }
    await updateBackwash({ bw_interval: n })
    await dialog.alert({ title: '저장 완료', description: '역세 주기가 갱신됐습니다' })
    setIsModifyMode(false)
  }

  const loss = step === 3 ? data.f_loss_head : data.f_loss_head_sc
  const aiLoss = step === 3 ? data.ai_f_loss_head : data.ai_f_loss_head_sc

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessPageHeader
        variant='dark'
        title={`여과 — 알고리즘 (${step}단계)`}
        step={{ current: step, threePath: '/filterAlgorithm', fourPath: '/filterAlgorithmS' }}
        mode={data.operation_mode}
        onModeChange={onModeChange}
        isModifyMode={isModifyMode}
        onModifyToggle={() => setIsModifyMode(!isModifyMode)}
        onSave={onSave}
        saveDisabled={isPending}
      />

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {isModifyMode ? (
          <div className='rounded-lg border border-[var(--aio-accent)]/50 bg-[var(--aio-panel)] p-4'>
            <div className='text-xs text-[var(--aio-subtitle)]'>역세 주기 (시간)</div>
            <Input
              className='mt-2 h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
              value={draftInterval}
              onChange={(e) => setDraftInterval(e.target.value)}
            />
          </div>
        ) : (
          <KpiCard variant='dark' label='역세 주기' value={data.bw_interval} unit='시간' />
        )}
        <KpiCard variant='dark' highlight label='AI 역세 추천 주기' value={data.ai_bw_interval} unit='시간' />
        <KpiCard variant='dark' label='여과 손실 수두' value={loss} unit='m' />
        <KpiCard variant='dark' highlight label='AI 손실 수두 예측' value={aiLoss} unit='m' />
        <KpiCard variant='dark' label='출구 탁도' value={data.f_out_tb} unit='NTU' />
        <KpiCard variant='dark' label='운영 중 여과지' value={data.f_running_count} unit='지' />
      </div>

      {data.schedule && data.schedule.length > 0 ? (
        <AioPanel>
          <div
            className='border-b border-[var(--aio-panel-border)] p-3 text-sm font-semibold text-[var(--aio-subtitle)]'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            여과지 운영 일정
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-[var(--aio-subtitle)]'>여과지</TableHead>
                <TableHead className='text-[var(--aio-subtitle)]'>시작</TableHead>
                <TableHead className='text-[var(--aio-subtitle)]'>종료</TableHead>
                <TableHead className='text-[var(--aio-subtitle)]'>다음 종료</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.schedule.map((s) => (
                <TableRow key={s.filter_no} className='text-white'>
                  <TableCell>#{s.filter_no}</TableCell>
                  <TableCell>{formatTime(s.start)}</TableCell>
                  <TableCell>{formatTime(s.end)}</TableCell>
                  <TableCell>{formatTime(s.next_end)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AioPanel>
      ) : null}

      {data.ai_f_loss_head_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart dark data={data.ai_f_loss_head_trend} title='AI 손실 수두 트렌드' yLabel='m' />
        </AioPanel>
      ) : null}
    </div>
  )
}
