'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { useRawLatestQuery } from '@/features/raw/queries/rawQueries'
import { useReceivingLatestQuery } from '@/features/receiving/queries/receivingQueries'
import { useCoagulantsLatestQuery } from '@/features/coagulants/queries/coagulantsQueries'
import { useMixingLatestQuery } from '@/features/mixing/queries/mixingQueries'
import { useSedimentationLatestQuery } from '@/features/sedimentation/queries/sedimentationQueries'
import { useFilterLatestQuery } from '@/features/filter/queries/filterQueries'
import { useGacLatestQuery } from '@/features/gac/queries/gacQueries'
import { useOzoneLatestQuery } from '@/features/ozone/queries/ozoneQueries'
import { useDisinfectionLatestQuery } from '@/features/disinfection/queries/disinfectionQueries'
import type { OperationMode } from '@/shared/components/ModeToggleBar'

const TrendLineChart = dynamic(
  () => import('@/features/dashboard/components/DashboardTrendChart'),
  { ssr: false, loading: () => <div className='text-[var(--aio-subtitle)] text-sm'>차트 로딩 중…</div> },
)

const MODE_LABEL: Record<OperationMode, string> = { 0: 'AI분석', 1: '부분AI', 2: 'AI' }

function modeLabel(mode: OperationMode | null | undefined) {
  if (mode === null || mode === undefined) return '-'
  return MODE_LABEL[mode]
}

interface ProcessNode {
  key: string
  title: string
  href: string
  icon: string
  mode: OperationMode | null | undefined
  metric: { label: string; value: number | null | undefined; unit?: string }
}

export function Dashboard() {
  const { data: raw } = useRawLatestQuery()
  const { data: receiving } = useReceivingLatestQuery()
  const { data: coagulants } = useCoagulantsLatestQuery()
  const { data: mixing } = useMixingLatestQuery()
  const { data: sedimentation } = useSedimentationLatestQuery()
  const { data: filter } = useFilterLatestQuery()
  const { data: gac } = useGacLatestQuery()
  const { data: ozone } = useOzoneLatestQuery()
  const { data: disinfection } = useDisinfectionLatestQuery()

  const processes: ProcessNode[] = [
    { key: 'receiving', title: '착수', href: '/receivingAlgorithm', icon: '/aio/dashboard/cube_receiving.png', mode: receiving?.operation_mode, metric: { label: '원수 유입', value: receiving?.b_in_fr_i ?? null, unit: 'm³/h' } },
    { key: 'coagulants', title: '응집', href: '/cgAlgorithm', icon: '/aio/dashboard/cube_coagulants.png', mode: coagulants?.operation_mode, metric: { label: '주입율', value: coagulants?.cg_dose ?? null, unit: 'mg/L' } },
    { key: 'mixing', title: '혼화', href: '/mtccAlgorithm', icon: '/aio/dashboard/cube_mixing.png', mode: mixing?.operation_mode, metric: { label: 'G값', value: mixing?.g_value ?? null, unit: 's⁻¹' } },
    { key: 'sedimentation', title: '침전', href: '/sedimentationAlgorithm', icon: '/aio/dashboard/cube_sedimentation.png', mode: sedimentation?.operation_mode, metric: { label: '출구 탁도', value: sedimentation?.e_out_tb ?? null, unit: 'NTU' } },
    { key: 'filter', title: '여과', href: '/filterAlgorithm', icon: '/aio/dashboard/cube_filter.png', mode: filter?.operation_mode, metric: { label: '손실 수두', value: filter?.f_loss_head ?? null, unit: 'm' } },
    { key: 'gac', title: 'GAC', href: '/gacAlgorithm', icon: '/aio/dashboard/cube_gac.png', mode: gac?.operation_mode, metric: { label: '손실 수두', value: gac?.g_loss_head ?? null, unit: 'm' } },
    { key: 'ozone', title: '오존', href: '/ozoneAlgorithm', icon: '/aio/dashboard/cube_ozone.png', mode: ozone?.operation_mode, metric: { label: '주입율', value: ozone?.oz_dose ?? null, unit: 'mg/L' } },
    { key: 'disinfection', title: '소독', href: '/disinfectionAlgorithm', icon: '/aio/dashboard/cube_disinfection.png', mode: disinfection?.operation_mode, metric: { label: '후염소', value: disinfection?.stages.after.cl_dose ?? null, unit: 'mg/L' } },
  ]

  return (
    <div
      className='-m-6 min-h-screen space-y-6 p-6 text-white'
      style={{
        background:
          'linear-gradient(180deg, var(--aio-bg) 0%, #0a0f1a 100%), url(/aio/dashboard/bg.webp) center/cover fixed',
        backgroundBlendMode: 'overlay',
      }}
    >
      <AioPageHeader
        title='성남정수장 AI 자율운영 시스템'
        description='9 공정 도메인의 핵심 지표를 한 화면에서 확인합니다'
        actions={
          <Link
            href='/operationboard'
            className='rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] px-4 py-2 text-sm font-medium text-[var(--aio-subtitle)] transition hover:brightness-125'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            주요감시현황 →
          </Link>
        }
      />

      {/* Main Factor + Brain + DashboardInfo */}
      <div className='grid gap-4 lg:grid-cols-[280px_1fr_360px]'>
        {/* MainFactor */}
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
          <KpiCard variant='dark' highlight label='원수 탁도' value={raw?.r_in_tb ?? '-'} unit='NTU' />
          <KpiCard variant='dark' highlight label='원수 유입 유량' value={receiving?.b_in_fr_i ?? '-'} unit='m³/h' />
          <KpiCard variant='dark' highlight label='정수 출구 탁도' value={gac?.g_out_tb ?? '-'} unit='NTU' />
          <KpiCard
            variant='dark'
            highlight
            label='잔류 염소 (후)'
            value={disinfection?.stages.after.cl_residual ?? '-'}
            unit='mg/L'
          />
        </div>

        {/* Brain (center) */}
        <AioPanel className='flex items-center justify-center p-6'>
          <div className='relative aspect-square w-full max-w-md'>
            <Image
              src='/aio/dashboard/brain.png'
              alt='AI Brain'
              fill
              priority
              sizes='(min-width: 1024px) 480px, 100vw'
              className='object-contain drop-shadow-[0_0_30px_rgba(92,175,255,0.45)]'
            />
            <div
              className='absolute bottom-2 left-0 right-0 text-center text-sm text-[var(--aio-subtitle)]'
              style={{ textShadow: 'var(--aio-text-glow)' }}
            >
              AI 자율운영 엔진
            </div>
          </div>
        </AioPanel>

        {/* DashboardInfo right panel */}
        <AioPanel className='p-4'>
          <div
            className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            자율운영 정보
          </div>
          <ul className='space-y-2'>
            {processes.map((p) => (
              <li key={p.key}>
                <Link
                  href={p.href}
                  className='flex items-center justify-between gap-3 rounded-md border border-transparent px-3 py-2 transition hover:border-[var(--aio-panel-border)] hover:bg-white/5'
                >
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block h-2 w-2 rounded-full bg-[var(--aio-accent)]'
                      style={{ boxShadow: '0 0 8px var(--aio-accent)' }}
                    />
                    <span className='font-medium text-white'>{p.title}</span>
                    <span className='rounded bg-[var(--aio-accent)]/20 px-1.5 py-0.5 text-[10px] font-medium text-[var(--aio-accent)]'>
                      {modeLabel(p.mode)}
                    </span>
                  </div>
                  <div className='text-right text-xs text-[var(--aio-subtitle)]'>
                    <div>{p.metric.label}</div>
                    <div className='text-sm font-semibold text-white'>
                      {p.metric.value ?? '-'}
                      {p.metric.unit ? <span className='ml-0.5 text-[10px] text-[var(--aio-subtitle)]'>{p.metric.unit}</span> : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </AioPanel>
      </div>

      {/* 정수장 건물 배치 다이어그램 */}
      <AioPanel className='p-6'>
        <div
          className='mb-4 text-sm font-semibold text-[var(--aio-subtitle)]'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          정수장 공정 배치
        </div>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8'>
          {processes.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className='group relative flex flex-col items-center gap-2 rounded-md border border-transparent p-3 transition hover:border-[var(--aio-panel-border)]'
            >
              <div className='relative h-16 w-16'>
                <Image
                  src={p.icon}
                  alt={p.title}
                  fill
                  sizes='64px'
                  className='object-contain drop-shadow-[0_0_12px_rgba(92,175,255,0.5)] transition group-hover:scale-110'
                />
              </div>
              <div
                className='text-sm font-medium text-white'
                style={{ textShadow: 'var(--aio-text-glow)' }}
              >
                {p.title}
              </div>
              <div className='text-[10px] text-[var(--aio-subtitle)]'>{modeLabel(p.mode)}</div>
            </Link>
          ))}
        </div>
      </AioPanel>

      {/* 트렌드 */}
      {receiving?.ai_b_in_fr_trend ? (
        <AioPanel className='p-4'>
          <TrendLineChart data={receiving.ai_b_in_fr_trend} title='원수 유입 유량 트렌드' yLabel='m³/h' />
        </AioPanel>
      ) : null}
    </div>
  )
}
