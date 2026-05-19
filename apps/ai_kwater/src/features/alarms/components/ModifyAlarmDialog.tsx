'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  alarmSettingSchema,
  type AlarmSettingFormValues,
} from '@/features/alarms/schemas/alarmSetting'
import { useUpdateAlarmSetting } from '@/features/alarms/queries/alarmsQueries'
import { dialog } from '@/libs/dialog'
import type { AlarmInfo } from '@/features/alarms/types/alarm'

interface Props {
  open: boolean
  alarm: AlarmInfo | null
  onOpenChange: (open: boolean) => void
}

export function ModifyAlarmDialog({ open, alarm, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useUpdateAlarmSetting()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlarmSettingFormValues>({
    resolver: zodResolver(alarmSettingSchema),
    defaultValues: { display_name: '', value: 0, scada_send: 0 },
  })

  useEffect(() => {
    if (alarm) {
      reset({
        display_name: alarm.display_name,
        value: alarm.value,
        scada_send: alarm.scada_send,
      })
    }
  }, [alarm, reset])

  const onSubmit = async (values: AlarmSettingFormValues) => {
    if (!alarm) return
    await mutateAsync({
      alarmInfoIndex: alarm.alarm_info_index,
      payload: {
        display_name: values.display_name,
        value: values.value,
        scada_send: values.scada_send,
      },
    })
    await dialog.alert({ title: '알람 정보 수정', description: '알람 정보가 수정 됐습니다' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>알람 정보 수정</DialogTitle>
            <DialogDescription>
              {alarm ? <span className='font-mono text-xs'>{alarm.alarm_id}</span> : null}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='alarm-display-name'>표시명</Label>
              <Input id='alarm-display-name' {...register('display_name')} />
              {errors.display_name && (
                <p className='text-destructive text-xs'>{errors.display_name.message}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='alarm-value'>임계값</Label>
              <Input id='alarm-value' type='number' step='any' {...register('value')} />
              {errors.value && <p className='text-destructive text-xs'>{errors.value.message}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='alarm-scada-send'>SCADA 전송 (0/1)</Label>
              <Input id='alarm-scada-send' type='number' min={0} max={1} step={1} {...register('scada_send')} />
              {errors.scada_send && (
                <p className='text-destructive text-xs'>{errors.scada_send.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? '저장 중…' : '확인'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
