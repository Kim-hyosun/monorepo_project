'use client'

import { useMemo, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { SimplePagination } from '@/shared/components/SimplePagination'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { useLoginHistoryQuery } from '@/features/loginHistory/queries/loginHistoryQueries'
import type { LoginHistoryEntry } from '@/features/loginHistory/types/loginHistory'

const PAGE_SIZE = 15

function formatTimestamp(value: string | undefined): string {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function loginTypeLabel(type: LoginHistoryEntry['type']): string {
  return type === 1 ? '로그인' : '로그아웃'
}

export function LoginHistoryTable() {
  const { data = [], isLoading } = useLoginHistoryQuery()
  const [pageNum, setPageNum] = useState(0)

  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const safePage = Math.min(pageNum, pageCount - 1)
  const paginated = useMemo(
    () => data.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [data, safePage],
  )

  return (
    <div className='space-y-4'>
      <PageHeader title='로그인 이력' description='접속/해제 로그 (최신순)' />

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>동작 분류</TableHead>
              <TableHead>접속 시간</TableHead>
              <TableHead>아이디</TableHead>
              <TableHead>아이피</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableEmpty colSpan={4}>로딩 중…</TableEmpty>
            ) : paginated.length === 0 ? (
              <TableEmpty colSpan={4}>이력이 없습니다</TableEmpty>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.login_history_index}>
                  <TableCell className={item.type === 1 ? 'font-medium text-emerald-600' : 'text-muted-foreground'}>
                    {loginTypeLabel(item.type)}
                  </TableCell>
                  <TableCell>{formatTimestamp(item.timestamp ?? item.login_time)}</TableCell>
                  <TableCell>{item.userid}</TableCell>
                  <TableCell>{item.address ?? item.ip}</TableCell>
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
