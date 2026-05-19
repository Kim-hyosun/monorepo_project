'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, type Path, type UseFormRegister, type FieldErrors } from 'react-hook-form'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  useNetworkConfigQuery,
  useUpdateNetworkConfig,
} from '@/features/network/queries/networkQueries'
import {
  networkConfigSchema,
  type NetworkConfigFormValues,
} from '@/features/network/schemas/networkConfig'
import { dialog } from '@/libs/dialog'

const EMPTY: NetworkConfigFormValues = {
  scada1_address: '',
  scada1_port: '',
  scada2_address: '',
  scada2_port: '',
  analysis1_address: '',
  analysis1_rm: '',
  analysis1_nm: '',
  analysis1_nn: '',
  analysis2_address: '',
  analysis2_rm: '',
  analysis2_nm: '',
  analysis2_nn: '',
}

interface FieldProps {
  label: string
  name: Path<NetworkConfigFormValues>
  disabled: boolean
  register: UseFormRegister<NetworkConfigFormValues>
  errors: FieldErrors<NetworkConfigFormValues>
}

function FormField({ label, name, disabled, register, errors }: FieldProps) {
  const err = errors[name]
  return (
    <div className='space-y-1.5'>
      <Label htmlFor={`net-${name}`}>{label}</Label>
      <Input id={`net-${name}`} disabled={disabled} {...register(name)} />
      {err && typeof err.message === 'string' ? (
        <p className='text-destructive text-xs'>{err.message}</p>
      ) : null}
    </div>
  )
}

export function ConfigNetworkForm() {
  const { data, isLoading } = useNetworkConfigQuery()
  const { mutateAsync, isPending } = useUpdateNetworkConfig()
  const [isModifyMode, setIsModifyMode] = useState(false)

  const form = useForm<NetworkConfigFormValues>({
    resolver: zodResolver(networkConfigSchema),
    defaultValues: EMPTY,
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const onSubmit = async (values: NetworkConfigFormValues) => {
    await mutateAsync(values)
    await dialog.alert({ title: '네트워크 설정', description: '네트워크 정보가 수정 됐습니다' })
    setIsModifyMode(false)
  }

  const onCancel = () => {
    if (data) reset(data)
    setIsModifyMode(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <PageHeader
        title='네트워크 설정'
        description='SCADA / 분석 시스템 접속 정보'
        actions={
          isModifyMode ? (
            <>
              <Button type='button' variant='outline' onClick={onCancel}>
                취소
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? '저장 중…' : '저장'}
              </Button>
            </>
          ) : (
            <Button type='button' onClick={() => setIsModifyMode(true)} disabled={isLoading}>
              수정
            </Button>
          )
        }
      />

      <div className='grid gap-4 md:grid-cols-2'>
        <section className='space-y-3 rounded-lg border p-4'>
          <h3 className='text-sm font-semibold'>SCADA 1</h3>
          <FormField label='IP' name='scada1_address' disabled={!isModifyMode} register={register} errors={errors} />
          <FormField label='Port' name='scada1_port' disabled={!isModifyMode} register={register} errors={errors} />
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h3 className='text-sm font-semibold'>SCADA 2</h3>
          <FormField label='IP' name='scada2_address' disabled={!isModifyMode} register={register} errors={errors} />
          <FormField label='Port' name='scada2_port' disabled={!isModifyMode} register={register} errors={errors} />
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h3 className='text-sm font-semibold'>분석 시스템 1</h3>
          <FormField label='IP' name='analysis1_address' disabled={!isModifyMode} register={register} errors={errors} />
          <div className='grid grid-cols-3 gap-3'>
            <FormField label='RM Port' name='analysis1_rm' disabled={!isModifyMode} register={register} errors={errors} />
            <FormField label='NM Port' name='analysis1_nm' disabled={!isModifyMode} register={register} errors={errors} />
            <FormField label='NN Port' name='analysis1_nn' disabled={!isModifyMode} register={register} errors={errors} />
          </div>
        </section>

        <section className='space-y-3 rounded-lg border p-4'>
          <h3 className='text-sm font-semibold'>분석 시스템 2</h3>
          <FormField label='IP' name='analysis2_address' disabled={!isModifyMode} register={register} errors={errors} />
          <div className='grid grid-cols-3 gap-3'>
            <FormField label='RM Port' name='analysis2_rm' disabled={!isModifyMode} register={register} errors={errors} />
            <FormField label='NM Port' name='analysis2_nm' disabled={!isModifyMode} register={register} errors={errors} />
            <FormField label='NN Port' name='analysis2_nn' disabled={!isModifyMode} register={register} errors={errors} />
          </div>
        </section>
      </div>
    </form>
  )
}
