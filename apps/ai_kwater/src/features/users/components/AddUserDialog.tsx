'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { isAxiosError } from 'axios'

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
import { addUserSchema, type AddUserFormValues } from '@/features/users/schemas/user'
import { useCreateUser } from '@/features/users/queries/userQueries'
import { dialog } from '@/libs/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateUser()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userid: '',
      name: '',
      password: '',
      password_confirm: '',
      partname: '',
    },
  })

  const onSubmit = async (values: AddUserFormValues) => {
    try {
      await mutateAsync({
        userid: values.userid,
        name: values.name,
        password: values.password,
        partname: values.partname,
        authority: 0,
      })
      await dialog.alert({ title: '사용자 생성', description: `${values.userid}가 생성됐습니다` })
      reset()
      onOpenChange(false)
    } catch (err: unknown) {
      // 409는 호출부에서 직접 처리. global error는 interceptor가 막아주므로 여기서는 메시지 분기만.
      if (isAxiosError(err) && err.response?.status === 409) {
        await dialog.alert({ title: '유저생성', description: '동일한 아이디가 존재합니다' })
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>사용자 생성</DialogTitle>
            <DialogDescription>새로운 사용자를 추가합니다.</DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='add-userid'>ID</Label>
              <Input id='add-userid' autoComplete='off' {...register('userid')} />
              {errors.userid && (
                <p className='text-destructive text-xs'>{errors.userid.message}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='add-password'>비밀번호</Label>
              <Input id='add-password' type='password' autoComplete='new-password' {...register('password')} />
              {errors.password && (
                <p className='text-destructive text-xs'>{errors.password.message}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='add-password-confirm'>비밀번호 확인</Label>
              <Input
                id='add-password-confirm'
                type='password'
                autoComplete='new-password'
                {...register('password_confirm')}
              />
              {errors.password_confirm && (
                <p className='text-destructive text-xs'>{errors.password_confirm.message}</p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='add-name'>이름</Label>
              <Input id='add-name' {...register('name')} />
              {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='add-partname'>부서</Label>
              <Input id='add-partname' {...register('partname')} />
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
