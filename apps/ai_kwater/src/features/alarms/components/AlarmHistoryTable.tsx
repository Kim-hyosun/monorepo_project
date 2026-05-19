'use client'

import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { SimplePagination } from '@/shared/components/SimplePagination'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { useAlarmHistoryMutation } from '@/features/alarms/queries/alarmsQueries'
import type { AlarmHistoryEntry } from '@/features/alarms/types/alarm'

const PAGE_SIZE = 15

function formatTs(ts: string | null): string {
  if (!ts) return '-'
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function defaultRange() {
  const now = new Date()
  const past = new Date(now.getTime() - 7 * 24 * 3600_000)
  const toLocalInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  return { start: toLocalInput(past), end: toLocalInput(now) }
}

export function AlarmHistoryTable() {
  const { mutateAsync, isPending } = useAlarmHistoryMutation()
  const [range, setRange] = useState(defaultRange())
  const [rows, setRows] = useState<AlarmHistoryEntry[]>([])
  const [pageNum, setPageNum] = useState(0)

  const search = async () => {
    const result = await mutateAsync({
      start_time: new Date(range.start).getTime(),
      end_time: new Date(range.end).getTime(),
      isInit: true,
    })
    setRows(result.alarms)
    setPageNum(0)
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(pageNum, pageCount - 1)
  const paginated = useMemo(
    () => rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [rows, safePage],
  )

  return (
    <div className='space-y-4'>
      <PageHeader title='알람 이력' description='기간을 선택해 알람 이력을 조회합니다' />

      <div className='flex flex-wrap items-end gap-3 rounded-lg border p-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='alarm-start'>시작</Label>
          <Input
            id='alarm-start'
            type='datetime-local'
            value={range.start}
            onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='alarm-end'>종료</Label>
          <Input
            id='alarm-end'
            type='datetime-local'
            value={range.end}
            onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
          />
        </div>
        <Button onClick={search} disabled={isPending}>
          {isPending ? '조회 중…' : '조회'}
        </Button>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>알람 ID</TableHead>
              <TableHead>발생 시각</TableHead>
              <TableHead>표시명</TableHead>
              <TableHead className='text-right'>값</TableHead>
              <TableHead>확인 시각</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableEmpty colSpan={5}>이력 없음</TableEmpty>
            ) : (
              paginated.map((row, idx) => (
                <TableRow key={`${row.alarm_id}-${row.alarm_time}-${idx}`}>
                  <TableCell className='font-mono text-xs'>{row.alarm_id}</TableCell>
                  <TableCell>{formatTs(row.alarm_time)}</TableCell>
                  <TableCell>{row.display_name}</TableCell>
                  <TableCell className='text-right'>{row.value}</TableCell>
                  <TableCell>{formatTs(row.ack_time)}</TableCell>
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
