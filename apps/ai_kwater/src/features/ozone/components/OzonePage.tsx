'use client'

import { TopNavigator } from '@/shared/components/TopNavigator'
import { ProcessPageHeader } from '@/shared/components/ProcessPageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { useOzoneLatestQuery, useUpdateOzoneOperation } from '@/features/ozone/queries/ozoneQueries'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function OzonePage() {
  const { data, isLoading } = useOzoneLatestQuery()
  const { mutateAsync } = useUpdateOzoneOperation()

  const onModeChange = (mode: OperationMode) => {
    mutateAsync({ operation_mode: mode })
  }

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <ProcessPageHeader
        variant='dark'
        title='오존 — 알고리즘'
        mode={data?.operation_mode ?? null}
        onModeChange={onModeChange}
      />

      {isLoading ? (
        <div className='text-[var(--aio-subtitle)] text-sm'>로딩 중…</div>
      ) : !data ? (
        <div className='text-[var(--aio-subtitle)] text-sm'>데이터 없음</div>
      ) : (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
          <KpiCard variant='dark' label='오존 농도' value={data.oz_density} unit='mg/L' />
          <KpiCard variant='dark' label='오존 주입율' value={data.oz_dose} unit='mg/L' />
          <KpiCard variant='dark' highlight label='AI 오존 주입율' value={data.ai_oz_dose} unit='mg/L' />
          <KpiCard variant='dark' label='잔류 오존' value={data.oz_residual} unit='mg/L' />
          <KpiCard variant='dark' label='처리량' value={data.oz_flow} unit='m³/h' />
        </div>
      )}
    </div>
  )
}
