'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import {
  useEmsCostSettingQuery,
  useEmsGoalQuery,
  useEmsLatestQuery,
  useEmsPeakSettingQuery,
  useUpdateEmsCostSetting,
  useUpdateEmsGoal,
  useUpdateEmsOperationMode,
  useUpdateEmsPeakSetting,
} from '@/features/ems/queries/emsQueries'
import {
  costSettingSchema,
  goalConfigSchema,
  peakSettingSchema,
  type CostSettingForm,
  type GoalConfigForm,
  type PeakSettingForm,
} from '@/features/ems/schemas/ems'
import { ModeToggleBar, type OperationMode } from '@/shared/components/ModeToggleBar'

export type SettingsVariant =
  | 'tagSetting'
  | 'pumpOperation'
  | 'costSetting'
  | 'goalSetting'
  | 'peak_set'

const VARIANT_META: Record<SettingsVariant, { title: string; description: string }> = {
  tagSetting: { title: '태그 설정', description: 'SCADA 태그 매핑 (TableEMS 페이지에서 편집)' },
  pumpOperation: { title: '펌프 운영', description: 'H1 / H2 펌프 운영 모드' },
  costSetting: { title: '비용 설정', description: '요금제 단가 설정' },
  goalSetting: { title: '목표 설정', description: '연간 절감 / 비용 / 피크 목표' },
  peak_set: { title: '피크 설정', description: '피크 시간대 / 한도 / DR' },
}

interface Props {
  variant: SettingsVariant
}

export function SettingsPage({ variant }: Props) {
  const meta = VARIANT_META[variant]
  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />
      {variant === 'pumpOperation' ? <PumpOperationSection /> : null}
      {variant === 'costSetting' ? <CostSettingSection /> : null}
      {variant === 'goalSetting' ? <GoalSettingSection /> : null}
      {variant === 'peak_set' ? <PeakSettingSection /> : null}
      {variant === 'tagSetting' ? (
        <AioPanel className='p-6 text-center text-[var(--aio-subtitle)]'>
          태그 설정은 <span className='text-white'>EMS 테이블</span> 페이지에서 관리합니다.
        </AioPanel>
      ) : null}
    </EmsPageWrapper>
  )
}

function PumpOperationSection() {
  const { data: latest } = useEmsLatestQuery()
  const updateMode = useUpdateEmsOperationMode()
  if (!latest) return <AioPanel className='p-6 text-[var(--aio-subtitle)]'>로딩 중…</AioPanel>
  const { pump } = latest
  return (
    <>
      <AioPanel className='p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-[var(--aio-subtitle)]'>평택 H1 펌프</h3>
          <ModeToggleBar
            variant='dark'
            value={pump.h1_operation_mode as OperationMode | null}
            onChange={(mode) => updateMode.mutate({ channel: 'h1', mode })}
            disabled={updateMode.isPending}
          />
        </div>
        <div className='mt-2 text-xs text-[var(--aio-subtitle)]'>
          현재 합계 {((pump.h1_pm1 ?? 0) + (pump.h1_pm2 ?? 0) + (pump.h1_pm3 ?? 0) + (pump.h1_pm4 ?? 0)).toFixed(1)}kW
        </div>
      </AioPanel>
      <AioPanel className='p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-[var(--aio-subtitle)]'>안성 H2 펌프</h3>
          <ModeToggleBar
            variant='dark'
            value={pump.h2_operation_mode as OperationMode | null}
            onChange={(mode) => updateMode.mutate({ channel: 'h2', mode })}
            disabled={updateMode.isPending}
          />
        </div>
        <div className='mt-2 text-xs text-[var(--aio-subtitle)]'>
          현재 합계 {((pump.h2_pm1 ?? 0) + (pump.h2_pm2 ?? 0) + (pump.h2_pm_sp1 ?? 0) + (pump.h2_pm_sp2 ?? 0)).toFixed(1)}kW
        </div>
      </AioPanel>
    </>
  )
}

function CostSettingSection() {
  const { data: setting } = useEmsCostSettingQuery()
  const update = useUpdateEmsCostSetting()
  const form = useForm<CostSettingForm>({
    resolver: zodResolver(costSettingSchema),
    defaultValues: { baseRate: 0, unitRate: 0, peakRate: 0, drDiscount: 0 },
  })
  useEffect(() => {
    if (setting) form.reset(setting)
  }, [setting, form])
  return (
    <AioPanel className='p-6'>
      <form
        onSubmit={form.handleSubmit((values) => update.mutate(values))}
        className='grid grid-cols-2 gap-4'
      >
        <Field label='기본요금 (원/kW)' error={form.formState.errors.baseRate?.message}>
          <Input type='number' step='0.01' {...form.register('baseRate')} />
        </Field>
        <Field label='사용량 단가 (원/kWh)' error={form.formState.errors.unitRate?.message}>
          <Input type='number' step='0.01' {...form.register('unitRate')} />
        </Field>
        <Field label='피크 단가 (원/kW)' error={form.formState.errors.peakRate?.message}>
          <Input type='number' step='0.01' {...form.register('peakRate')} />
        </Field>
        <Field label='DR 할인율 (%)' error={form.formState.errors.drDiscount?.message}>
          <Input type='number' step='0.1' {...form.register('drDiscount')} />
        </Field>
        <div className='col-span-2 flex justify-end'>
          <Button type='submit' disabled={update.isPending}>
            저장
          </Button>
        </div>
      </form>
    </AioPanel>
  )
}

function GoalSettingSection() {
  const { data: goal } = useEmsGoalQuery()
  const update = useUpdateEmsGoal()
  const form = useForm<GoalConfigForm>({
    resolver: zodResolver(goalConfigSchema),
    defaultValues: { targetReductionPct: 0, targetPeakKw: 0, targetCostKrw: 0, fiscalYear: new Date().getFullYear() },
  })
  useEffect(() => {
    if (goal) form.reset(goal)
  }, [goal, form])
  return (
    <AioPanel className='p-6'>
      <form
        onSubmit={form.handleSubmit((values) => update.mutate(values))}
        className='grid grid-cols-2 gap-4'
      >
        <Field label='절감 목표 (%)' error={form.formState.errors.targetReductionPct?.message}>
          <Input type='number' step='0.1' {...form.register('targetReductionPct')} />
        </Field>
        <Field label='피크 목표 (kW)' error={form.formState.errors.targetPeakKw?.message}>
          <Input type='number' {...form.register('targetPeakKw')} />
        </Field>
        <Field label='비용 목표 (원)' error={form.formState.errors.targetCostKrw?.message}>
          <Input type='number' {...form.register('targetCostKrw')} />
        </Field>
        <Field label='회계년도' error={form.formState.errors.fiscalYear?.message}>
          <Input type='number' {...form.register('fiscalYear')} />
        </Field>
        <div className='col-span-2 flex justify-end'>
          <Button type='submit' disabled={update.isPending}>
            저장
          </Button>
        </div>
      </form>
    </AioPanel>
  )
}

function PeakSettingSection() {
  const { data: peak } = useEmsPeakSettingQuery()
  const update = useUpdateEmsPeakSetting()
  const form = useForm<PeakSettingForm>({
    resolver: zodResolver(peakSettingSchema),
    defaultValues: { peakStartHour: 13, peakEndHour: 17, peakLimitKw: 0, drDispatchKw: 0, enabled: false },
  })
  useEffect(() => {
    if (peak) form.reset(peak)
  }, [peak, form])
  return (
    <AioPanel className='p-6'>
      <form
        onSubmit={form.handleSubmit((values) => update.mutate(values))}
        className='grid grid-cols-2 gap-4'
      >
        <Field label='피크 시작 (0-23)' error={form.formState.errors.peakStartHour?.message}>
          <Input type='number' {...form.register('peakStartHour')} />
        </Field>
        <Field label='피크 종료 (0-23)' error={form.formState.errors.peakEndHour?.message}>
          <Input type='number' {...form.register('peakEndHour')} />
        </Field>
        <Field label='피크 한도 (kW)' error={form.formState.errors.peakLimitKw?.message}>
          <Input type='number' {...form.register('peakLimitKw')} />
        </Field>
        <Field label='DR Dispatch (kW)' error={form.formState.errors.drDispatchKw?.message}>
          <Input type='number' {...form.register('drDispatchKw')} />
        </Field>
        <label className='col-span-2 flex items-center gap-2 text-white'>
          <input type='checkbox' {...form.register('enabled')} />
          제어 활성화
        </label>
        <div className='col-span-2 flex justify-end'>
          <Button type='submit' disabled={update.isPending}>
            저장
          </Button>
        </div>
      </form>
    </AioPanel>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-1'>
      <Label className='text-[var(--aio-subtitle)]'>{label}</Label>
      {children}
      {error ? <div className='text-xs text-rose-400'>{error}</div> : null}
    </div>
  )
}
