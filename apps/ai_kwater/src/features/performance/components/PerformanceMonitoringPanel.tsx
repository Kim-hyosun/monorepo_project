'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  useLatestMonitoringQuery,
  useMonitoringQuery,
  useResourcesQuery,
  useUpdateResourceName,
} from '@/features/performance/queries/performanceQueries'
import { PERFORMANCE_TYPE } from '@/features/performance/types/performance'
import { dialog } from '@/libs/dialog'

const MonitoringLineChart = dynamic(
  () => import('@/features/performance/components/MonitoringLineChart'),
  {
    ssr: false,
    loading: () => <div className='text-muted-foreground text-sm'>차트 로딩 중…</div>,
  },
)

export function PerformanceMonitoringPanel() {
  const { data: resources = [], isLoading } = useResourcesQuery()
  const { data: latest = [] } = useLatestMonitoringQuery()
  const [selected, setSelected] = useState<string | null>(null)
  const { data: monitoring = [] } = useMonitoringQuery(selected)

  const { mutateAsync, isPending } = useUpdateResourceName()
  const [editName, setEditName] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    if (!selected && resources.length > 0) {
      setSelected(resources[0].systemInfo.hostname)
    }
  }, [resources, selected])

  const selectedResource = resources.find((r) => r.systemInfo.hostname === selected)
  const latestForSelected = latest.filter((m) => m.hostname === selected)
  const cpuValue = latestForSelected.find((m) => m.type === PERFORMANCE_TYPE.CPU)?.value
  const memoryValue = latestForSelected.find((m) => m.type === PERFORMANCE_TYPE.MEMORY)?.value
  const diskValue = latestForSelected.find((m) => m.type === PERFORMANCE_TYPE.DISK)?.value

  const startEdit = () => {
    if (!selectedResource) return
    setEditName(selectedResource.systemInfo.hostname)
    setDraftName(selectedResource.systemInfo.name)
  }

  const saveEdit = async () => {
    if (!editName) return
    await mutateAsync({ hostname: editName, payload: { name: draftName } })
    await dialog.alert({ title: '정보 수정', description: `이름이 '${draftName}' 으로 변경됐습니다` })
    setEditName(null)
  }

  return (
    <div className='space-y-4'>
      <PageHeader title='성능 모니터링' description='호스트 리소스 사용률 (1분 주기 갱신)' />

      {isLoading ? (
        <div className='text-muted-foreground text-sm'>로딩 중…</div>
      ) : resources.length === 0 ? (
        <div className='text-muted-foreground text-sm'>등록된 호스트가 없습니다</div>
      ) : (
        <div className='grid gap-4 md:grid-cols-[260px_1fr]'>
          <aside className='space-y-2'>
            {resources.map((r) => {
              const active = r.systemInfo.hostname === selected
              return (
                <button
                  key={r.systemInfo.hostname}
                  type='button'
                  onClick={() => setSelected(r.systemInfo.hostname)}
                  className={
                    'block w-full rounded-md border p-3 text-left transition ' +
                    (active ? 'border-primary bg-primary/5' : 'hover:bg-muted/50')
                  }
                >
                  <div className='text-sm font-medium'>{r.systemInfo.name}</div>
                  <div className='text-muted-foreground font-mono text-xs'>
                    {r.systemInfo.hostname}
                  </div>
                </button>
              )
            })}
          </aside>

          <section className='space-y-4'>
            {selectedResource ? (
              <>
                <div className='rounded-lg border p-4'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <div className='text-muted-foreground text-xs'>호스트</div>
                      <div className='font-mono text-sm'>{selectedResource.systemInfo.hostname}</div>
                    </div>
                    {editName === selectedResource.systemInfo.hostname ? (
                      <div className='flex items-center gap-2'>
                        <Label className='text-xs'>표시명</Label>
                        <Input
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className='w-48'
                        />
                        <Button size='sm' onClick={saveEdit} disabled={isPending || !draftName}>
                          {isPending ? '저장…' : '저장'}
                        </Button>
                        <Button size='sm' variant='outline' onClick={() => setEditName(null)}>
                          취소
                        </Button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          <div className='text-muted-foreground text-xs'>표시명</div>
                          <div className='text-sm font-medium'>{selectedResource.systemInfo.name}</div>
                        </div>
                        <Button size='sm' variant='secondary' onClick={startEdit}>
                          이름 수정
                        </Button>
                      </div>
                    )}
                  </div>
                  <dl className='mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-4'>
                    <Stat label='CPU' value={selectedResource.systemInfo.cpu_model ?? '-'} />
                    <Stat label='코어' value={selectedResource.systemInfo.cpu_cores ?? '-'} />
                    <Stat
                      label='메모리'
                      value={selectedResource.systemInfo.memory_total ? `${selectedResource.systemInfo.memory_total} MB` : '-'}
                    />
                    <Stat label='OS' value={selectedResource.systemInfo.os ?? '-'} />
                  </dl>
                </div>

                <div className='grid grid-cols-3 gap-3'>
                  <KpiCard label='CPU' value={cpuValue} />
                  <KpiCard label='Memory' value={memoryValue} />
                  <KpiCard label='Disk' value={diskValue} />
                </div>

                <div className='rounded-lg border p-4'>
                  <MonitoringLineChart data={monitoring} />
                </div>
              </>
            ) : null}
          </section>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className='text-muted-foreground text-xs'>{label}</dt>
      <dd className='text-sm font-medium'>{value}</dd>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className='rounded-lg border p-4'>
      <div className='text-muted-foreground text-xs'>{label}</div>
      <div className='mt-1 text-2xl font-semibold'>{value !== undefined ? `${value}%` : '-'}</div>
    </div>
  )
}
