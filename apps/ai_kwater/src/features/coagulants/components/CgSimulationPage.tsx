'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { TopNavigator } from '@/shared/components/TopNavigator'
import { KpiCard } from '@/shared/components/KpiCard'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useCgSimulate } from '@/features/coagulants/queries/coagulantsQueries'
import {
  cgSimulationSchema,
  type CgSimulationFormValues,
} from '@/features/coagulants/schemas/cgSimulation'
import type { CgSimulationResult } from '@/features/coagulants/types/coagulants'

const DARK_WRAPPER_STYLE = {
  background: 'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%)',
} as const

export function CgSimulationPage() {
  const { mutateAsync, isPending } = useCgSimulate()
  const [result, setResult] = useState<CgSimulationResult | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CgSimulationFormValues>({
    resolver: zodResolver(cgSimulationSchema),
    defaultValues: { turbidity: 3.4, alkalinity: 28, ph: 7.4 },
  })

  const onSubmit = async (values: CgSimulationFormValues) => {
    const r = await mutateAsync(values)
    setResult(r)
  }

  return (
    <div className='-m-6 min-h-screen space-y-4 p-6 text-white' style={DARK_WRAPPER_STYLE}>
      <TopNavigator variant='dark' />
      <AioPageHeader title='응집 — 시뮬레이션' description='원수 조건 입력 → 응집제 추천값 산출' />

      <AioPanel className='p-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            <Field id='sim-turbidity' label='탁도 (NTU)' err={errors.turbidity?.message}>
              <Input
                id='sim-turbidity'
                type='number'
                step='any'
                className='border-[var(--aio-panel-border)] bg-transparent text-white'
                {...register('turbidity')}
              />
            </Field>
            <Field id='sim-alkalinity' label='알칼리도 (mg/L)' err={errors.alkalinity?.message}>
              <Input
                id='sim-alkalinity'
                type='number'
                step='any'
                className='border-[var(--aio-panel-border)] bg-transparent text-white'
                {...register('alkalinity')}
              />
            </Field>
            <Field id='sim-ph' label='pH' err={errors.ph?.message}>
              <Input
                id='sim-ph'
                type='number'
                step='any'
                className='border-[var(--aio-panel-border)] bg-transparent text-white'
                {...register('ph')}
              />
            </Field>
          </div>
          <div className='flex justify-end'>
            <Button type='submit' disabled={isPending}>
              {isPending ? '계산 중…' : '시뮬레이션 실행'}
            </Button>
          </div>
        </form>
      </AioPanel>

      {result ? (
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <KpiCard variant='dark' highlight label='추천 주입율' value={result.recommended_dose} unit='mg/L' />
          <KpiCard variant='dark' label='예상 잔류 탁도' value={result.expected_residual_turbidity} unit='NTU' />
          <KpiCard variant='dark' label='예상 pH' value={result.expected_ph} />
        </div>
      ) : null}
    </div>
  )
}

function Field({ id, label, err, children }: { id: string; label: string; err?: string; children: React.ReactNode }) {
  return (
    <div className='space-y-1.5'>
      <Label htmlFor={id} className='text-[var(--aio-subtitle)]'>
        {label}
      </Label>
      {children}
      {err ? <p className='text-destructive text-xs'>{err}</p> : null}
    </div>
  )
}
