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
import { useAlarmSettingsQuery } from '@/features/alarms/queries/alarmsQueries'
import { alarmTypeLabel, classifyByAlarmId } from '@/features/alarms/utils/classify'
import type { AlarmInfo } from '@/features/alarms/types/alarm'

interface Props {
  onModify: (alarm: AlarmInfo) => void
}

const PAGE_SIZE = 15

export function AlarmTable({ onModify }: Props) {
  const { data = [], isLoading } = useAlarmSettingsQuery()
  const [pageNum, setPageNum] = useState(0)

  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const safePage = Math.min(pageNum, pageCount - 1)
  const paginated = useMemo(
    () => data.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [data, safePage],
  )

  return (
    <div className='space-y-4'>
      <PageHeader title='알람 관리' description='알람 임계값과 SCADA 전송 여부를 설정합니다' />

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>알람 ID</TableHead>
              <TableHead>분류</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>표시명</TableHead>
              <TableHead className='text-right'>임계값</TableHead>
              <TableHead className='text-right'>SCADA</TableHead>
              <TableHead className='text-right'>동작</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableEmpty colSpan={7}>로딩 중…</TableEmpty>
            ) : paginated.length === 0 ? (
              <TableEmpty colSpan={7}>알람 항목이 없습니다</TableEmpty>
            ) : (
              paginated.map((alarm) => (
                <TableRow key={alarm.alarm_info_index}>
                  <TableCell className='font-mono text-xs'>{alarm.alarm_id}</TableCell>
                  <TableCell>{classifyByAlarmId(alarm.alarm_id)}</TableCell>
                  <TableCell>{alarmTypeLabel(alarm.type)}</TableCell>
                  <TableCell>{alarm.display_name}</TableCell>
                  <TableCell className='text-right'>{alarm.value}</TableCell>
                  <TableCell className='text-right'>{alarm.scada_send ? '전송' : '미전송'}</TableCell>
                  <TableCell className='text-right'>
                    <Button size='sm' variant='secondary' onClick={() => onModify(alarm)}>
                      수정
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
