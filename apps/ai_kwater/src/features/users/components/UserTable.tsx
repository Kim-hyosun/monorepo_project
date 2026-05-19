'use client'

import { useMemo, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { SimplePagination } from '@/shared/components/SimplePagination'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import type { User } from '@/features/users/types/user'

interface Props {
  data: User[]
  isLoading: boolean
  onAdd: () => void
  onModify: (user: User) => void
  onResetPassword: (user: User) => void
  onDelete: (user: User) => void
}

const PAGE_SIZE = 15

export function UserTable({ data, isLoading, onAdd, onModify, onResetPassword, onDelete }: Props) {
  const [pageNum, setPageNum] = useState(0)

  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const safePage = Math.min(pageNum, pageCount - 1)
  const paginated = useMemo(
    () => data.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [data, safePage],
  )

  return (
    <div className='space-y-4'>
      <PageHeader title='사용자 관리' actions={<Button onClick={onAdd}>+ 추가</Button>} />

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>아이디</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>부서</TableHead>
              <TableHead className='text-right'>동작</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableEmpty colSpan={4}>로딩 중…</TableEmpty>
            ) : paginated.length === 0 ? (
              <TableEmpty colSpan={4}>사용자가 없습니다</TableEmpty>
            ) : (
              paginated.map((user) => (
                <TableRow key={user.userid}>
                  <TableCell className='font-medium'>{user.userid}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.partname}</TableCell>
                  <TableCell className='flex justify-end gap-2'>
                    <Button size='sm' variant='secondary' onClick={() => onModify(user)}>
                      수정
                    </Button>
                    <Button size='sm' variant='outline' onClick={() => onResetPassword(user)}>
                      비밀번호 초기화
                    </Button>
                    <Button size='sm' variant='destructive' onClick={() => onDelete(user)}>
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination page={safePage} pageCount={pageCount} onChange={setPageNum} />
    </div>
  )
}
