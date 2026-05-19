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
import { modifyUserSchema, type ModifyUserFormValues } from '@/features/users/schemas/user'
import { useUpdateUser } from '@/features/users/queries/userQueries'
import type { User } from '@/features/users/types/user'

interface Props {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function ModifyUserDialog({ open, user, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useUpdateUser()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModifyUserFormValues>({
    resolver: zodResolver(modifyUserSchema),
    defaultValues: { name: '', partname: '' },
  })

  useEffect(() => {
    if (user) reset({ name: user.name, partname: user.partname })
  }, [user, reset])

  const onSubmit = async (values: ModifyUserFormValues) => {
    if (!user) return
    try {
      await mutateAsync({
        userid: user.userid,
        payload: { name: values.name, partname: values.partname },
      })
      await dialog.alert({ title: '사용자 정보 수정', description: '사용자 정보가 수정됐습니다' })
      onOpenChange(false)
    } catch {
      await dialog.alert({ title: '오류', description: '사용자 수정에 실패했습니다' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>사용자 정보 수정</DialogTitle>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label>ID</Label>
              <Input value={user?.userid ?? ''} disabled />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='modify-name'>이름</Label>
              <Input id='modify-name' {...register('name')} />
              {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='modify-partname'>부서</Label>
              <Input id='modify-partname' {...register('partname')} />
              {errors.partname && (
                <p className='text-destructive text-xs'>{errors.partname.message}</p>
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
