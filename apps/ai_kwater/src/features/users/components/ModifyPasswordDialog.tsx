'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { dialog } from '@/libs/dialog'
import {
  modifyPasswordSchema,
  type ModifyPasswordFormValues,
} from '@/features/users/schemas/user'
import { useResetUserPassword } from '@/features/users/queries/userQueries'
import type { User } from '@/features/users/types/user'

interface Props {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function ModifyPasswordDialog({ open, user, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useResetUserPassword()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModifyPasswordFormValues>({
    resolver: zodResolver(modifyPasswordSchema),
    defaultValues: { password: '', password_confirm: '' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = async (values: ModifyPasswordFormValues) => {
    if (!user) return
    try {
      await mutateAsync({ userid: user.userid, payload: { password: values.password } })
      await dialog.alert({
        title: '사용자 암호 초기화',
        description: '사용자 암호가 초기화됐습니다',
      })
      onOpenChange(false)
    } catch {
      await dialog.alert({ title: '오류', description: '암호 초기화에 실패했습니다' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>비밀번호 초기화</DialogTitle>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label>ID</Label>
              <Input value={user?.userid ?? ''} disabled />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='pw-new'>새 비밀번호</Label>
              <Input id='pw-new' type='password' autoComplete='new-password' {...register('password')} />
              {errors.password && (
                <p className='text-destructive text-xs'>{errors.password.message}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='pw-confirm'>비밀번호 확인</Label>
              <Input
                id='pw-confirm'
                type='password'
                autoComplete='new-password'
                {...register('password_confirm')}
              />
              {errors.password_confirm && (
                <p className='text-destructive text-xs'>{errors.password_confirm.message}</p>
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
