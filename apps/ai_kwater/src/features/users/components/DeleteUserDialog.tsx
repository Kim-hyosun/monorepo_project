'use client'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { dialog } from '@/libs/dialog'
import { useDeleteUser } from '@/features/users/queries/userQueries'
import type { User } from '@/features/users/types/user'

interface Props {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function DeleteUserDialog({ open, user, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useDeleteUser()

  const onConfirm = async () => {
    if (!user) return
    try {
      await mutateAsync(user.userid)
      await dialog.alert({ title: '사용자 삭제', description: `${user.userid}가 삭제됐습니다` })
      onOpenChange(false)
    } catch {
      await dialog.alert({ title: '오류', description: '사용자 삭제에 실패했습니다' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 삭제</DialogTitle>
          <DialogDescription>
            사용자 <strong>{user?.userid}</strong> 을(를) 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isPending}>
            취소
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={isPending}>
            {isPending ? '삭제 중…' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
