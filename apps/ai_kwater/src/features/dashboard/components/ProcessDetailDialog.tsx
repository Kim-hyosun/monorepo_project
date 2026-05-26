'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { useProcessDialogStore } from '@/stores/processDialogStore'

const MiniDarkTrendChart = dynamic(() => import('@/shared/components/MiniDarkTrendChart'), {
  ssr: false,
  loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div>,
})

export interface ProcessDetailKpi {
  label: string
  value: number | string | null | undefined
  unit?: string
  highlight?: boolean
}

export interface ProcessDetailPayload {
  title: string
  subtitle?: string
  icon: string
  href: string
  mode?: number | null
  kpis: ProcessDetailKpi[]
  trend?: Array<[number, number]>
  trendUnit?: string
}

const MODE_LABEL: Record<number, string> = { 0: 'AI분석', 1: '부분AI', 2: 'AI' }

interface Props {
  payloadByKey: Record<string, ProcessDetailPayload>
}

/**
 * Dashboard 의 8 공정 미니카드 클릭 → 공정별 KPI 상세 + 미니 트렌드 popup.
 * 호출부(Dashboard.tsx) 에서 9 도메인 query 결과를 하나의 payload map 으로 전달.
 * Popup 내부에서 '상세 페이지로 이동' 버튼 → 기존 라우트 이동.
 */
export function ProcessDetailDialog({ payloadByKey }: Props) {
  const { processDetail, closeProcessDetail } = useProcessDialogStore()
  const key = processDetail.processKey
  const payload = key ? payloadByKey[key] : undefined

  return (
    <Dialog open={processDetail.visible} onOpenChange={(open) => !open && closeProcessDetail()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPrimitive.Popup
          className='fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-6 text-white shadow-xl backdrop-blur'
          style={{ backgroundImage: 'var(--aio-divider-gradient)' }}
        >
          <DialogHeader>
            <DialogTitle
              className='flex items-center gap-3 text-[var(--aio-accent)]'
              style={{ textShadow: 'var(--aio-text-glow)' }}
            >
              {payload ? (
                <>
                  <span className='relative inline-block h-9 w-9'>
                    <Image
                      src={payload.icon}
                      alt=''
                      fill
                      sizes='36px'
                      className='object-contain drop-shadow-[0_0_8px_rgba(92,175,255,0.7)]'
                    />
                  </span>
                  <span>{payload.title} 공정 상세</span>
                  {payload.mode !== null && payload.mode !== undefined ? (
                    <span className='rounded bg-[var(--aio-accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--aio-accent)]'>
                      {MODE_LABEL[payload.mode] ?? '-'}
                    </span>
                  ) : null}
                </>
              ) : (
                <span>공정 상세</span>
              )}
            </DialogTitle>
            {payload?.subtitle ? (
              <DialogDescription className='text-[var(--aio-subtitle)]'>
                {payload.subtitle}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {payload ? (
            <div className='mt-4 space-y-4'>
              {/* KPI grid */}
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {payload.kpis.map((k, i) => (
                  <div
                    key={i}
                    className={`rounded-md border px-3 py-2 ${
                      k.highlight
                        ? 'border-[var(--aio-accent)]/50 bg-[var(--aio-accent)]/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className='text-[10px] text-[var(--aio-subtitle)]'>{k.label}</div>
                    <div className='mt-0.5'>
                      <span className='text-base font-semibold text-white'>
                        {k.value === null || k.value === undefined || k.value === ''
                          ? '-'
                          : k.value}
                      </span>
                      {k.unit ? (
                        <span className='ml-0.5 text-[10px] text-[var(--aio-subtitle)]'>
                          {k.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* mini trend */}
              {payload.trend && payload.trend.length > 0 ? (
                <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-2'>
                  <MiniDarkTrendChart
                    data={payload.trend}
                    color='#5cafff'
                    yLabel={payload.trendUnit}
                    height={180}
                  />
                </div>
              ) : (
                <div className='rounded-md border border-dashed border-white/10 px-3 py-6 text-center text-xs text-[var(--aio-subtitle)]'>
                  트렌드 데이터가 아직 없습니다.
                </div>
              )}
            </div>
          ) : (
            <div className='mt-4 text-sm text-[var(--aio-subtitle)]'>선택된 공정이 없습니다.</div>
          )}

          <DialogFooter className='mt-4 gap-2'>
            <Button size='sm' variant='ghost' onClick={closeProcessDetail}>
              닫기
            </Button>
            {payload ? (
              <Link
                href={payload.href}
                onClick={closeProcessDetail}
                className='inline-flex items-center justify-center rounded-md border border-[var(--aio-accent)]/50 bg-[var(--aio-accent)]/15 px-3 py-1.5 text-sm font-medium text-[var(--aio-accent)] transition hover:brightness-125'
              >
                상세 페이지로 이동 →
              </Link>
            ) : null}
          </DialogFooter>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
