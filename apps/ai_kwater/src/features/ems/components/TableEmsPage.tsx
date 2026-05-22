'use client'

import { useMemo, useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import { useEmsTagsQuery, useUpdateEmsTag } from '@/features/ems/queries/emsQueries'
import type { EmsTag } from '@/features/ems/types/ems'

type EditState = { id: string; tag: string; label: string; unit: string } | null

export function TableEmsPage() {
  const { data: tags = [] } = useEmsTagsQuery()
  const update = useUpdateEmsTag()
  const [editing, setEditing] = useState<EditState>(null)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return tags
    return tags.filter(
      (t) => t.tag.toLowerCase().includes(q) || t.label.toLowerCase().includes(q),
    )
  }, [tags, filter])

  const start = (t: EmsTag) =>
    setEditing({ id: t.id, tag: t.tag, label: t.label, unit: t.unit })

  const save = () => {
    if (!editing) return
    update.mutate(
      { id: editing.id, patch: { tag: editing.tag, label: editing.label, unit: editing.unit } },
      { onSuccess: () => setEditing(null) },
    )
  }

  return (
    <EmsPageWrapper>
      <AioPageHeader title='EMS 테이블' description='SCADA 태그 매핑' />

      <AioPanel className='p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <Input
            placeholder='태그 또는 라벨 검색'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='max-w-sm border-[var(--aio-panel-border)] bg-transparent text-white'
          />
          <div className='ml-auto text-xs text-[var(--aio-subtitle)]'>총 {filtered.length}개</div>
        </div>

        <table className='w-full text-sm'>
          <thead className='text-[var(--aio-subtitle)]'>
            <tr>
              <th className='py-2 text-left'>SCADA Tag</th>
              <th className='py-2 text-left'>라벨</th>
              <th className='py-2 text-left'>단위</th>
              <th className='py-2 text-left'>카테고리</th>
              <th className='py-2 text-center'>활성</th>
              <th className='py-2 text-right'></th>
            </tr>
          </thead>
          <tbody className='text-white'>
            {filtered.map((t) => {
              const isEditing = editing?.id === t.id
              return (
                <tr key={t.id} className='border-t border-[var(--aio-panel-border)]'>
                  <td className='py-2'>
                    {isEditing ? (
                      <Input
                        value={editing!.tag}
                        onChange={(e) => setEditing({ ...editing!, tag: e.target.value })}
                        className='h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
                      />
                    ) : (
                      <span className='font-mono text-xs'>{t.tag}</span>
                    )}
                  </td>
                  <td className='py-2'>
                    {isEditing ? (
                      <Input
                        value={editing!.label}
                        onChange={(e) => setEditing({ ...editing!, label: e.target.value })}
                        className='h-8 border-[var(--aio-panel-border)] bg-transparent text-white'
                      />
                    ) : (
                      t.label
                    )}
                  </td>
                  <td className='py-2'>
                    {isEditing ? (
                      <Input
                        value={editing!.unit}
                        onChange={(e) => setEditing({ ...editing!, unit: e.target.value })}
                        className='h-8 w-20 border-[var(--aio-panel-border)] bg-transparent text-white'
                      />
                    ) : (
                      t.unit
                    )}
                  </td>
                  <td className='py-2 text-[var(--aio-subtitle)]'>{t.category}</td>
                  <td className='py-2 text-center'>
                    <input
                      type='checkbox'
                      checked={t.enabled}
                      onChange={() => update.mutate({ id: t.id, patch: { enabled: !t.enabled } })}
                    />
                  </td>
                  <td className='py-2 text-right'>
                    {isEditing ? (
                      <div className='flex justify-end gap-1'>
                        <Button size='sm' onClick={save} disabled={update.isPending}>
                          저장
                        </Button>
                        <Button size='sm' variant='ghost' onClick={() => setEditing(null)}>
                          취소
                        </Button>
                      </div>
                    ) : (
                      <Button size='sm' variant='ghost' onClick={() => start(t)}>
                        편집
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </AioPanel>
    </EmsPageWrapper>
  )
}
