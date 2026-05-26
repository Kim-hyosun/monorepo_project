'use client'

import Image from 'next/image'

import { AioPanel } from '@/shared/components/AioPanel'
import { cn } from '@/shared/utils/cn'

export type ProcessCubeKey =
  | 'receiving'
  | 'coagulants'
  | 'mixing'
  | 'sedimentation'
  | 'filter'
  | 'gac'
  | 'ozone'
  | 'disinfection'

interface MetricGlow {
  value: number | null | undefined
  /** 0~1 비율 정규화에 사용. 미지정 시 100. */
  max?: number
  /** 미지정 시 0. */
  min?: number
}

interface Props {
  cubeKey: ProcessCubeKey
  title: string
  subtitle?: string
  className?: string
  /** operation_mode (0=AI분석 / 1=부분AI / 2=AI). 미지정 시 기본 blue glow */
  mode?: number | null
  /** primary KPI 값 기반 glow 강도 동적 변경 */
  metric?: MetricGlow
}

const MODE_COLOR: Record<number, string> = {
  0: '#5cafff', // AI분석 — blue
  1: '#fbbf24', // 부분AI — amber
  2: '#34d399', // AI — emerald
}

/**
 * 공정 페이지 상단 다크 hero — cube_<key>.png + 제목/부제목 + dynamic glow ring.
 * operation_mode 에 따라 ring 컬러 분기, metric value 에 따라 glow 강도 비율 변화.
 * 호출부 호환: mode/metric props 미전달 시 기존 동작과 동일.
 */
export function ProcessHero({ cubeKey, title, subtitle, className, mode, metric }: Props) {
  const color = mode !== undefined && mode !== null ? (MODE_COLOR[mode] ?? '#5cafff') : '#5cafff'

  // glow strength: metric value 0~1 비율 → blur radius 12~28px, opacity 0.45~0.95
  let strength = 0.6
  if (metric && metric.value !== null && metric.value !== undefined) {
    const min = metric.min ?? 0
    const max = metric.max ?? 100
    const range = Math.max(1, max - min)
    const ratio = Math.max(0, Math.min(1, (metric.value - min) / range))
    strength = 0.45 + ratio * 0.5
  }
  const blurPx = 12 + strength * 16
  const dropShadow = `drop-shadow(0 0 ${blurPx.toFixed(0)}px ${color}${alphaHex(strength)})`

  return (
    <AioPanel className={cn('relative overflow-hidden p-4', className)}>
      <Image
        src='/aio/dashboard/waterwall_back.png'
        alt=''
        fill
        sizes='100vw'
        className='pointer-events-none select-none object-cover opacity-[0.07]'
      />
      <div className='relative flex items-center gap-4'>
        <div className='relative h-20 w-20 shrink-0'>
          {/* dynamic glow ring (mode color + metric strength) */}
          <svg viewBox='0 0 80 80' className='absolute inset-0' aria-hidden='true'>
            <defs>
              <radialGradient id={`hero-glow-${cubeKey}`} cx='50%' cy='50%' r='50%'>
                <stop offset='0%' stopColor={color} stopOpacity={strength * 0.5} />
                <stop offset='60%' stopColor={color} stopOpacity={strength * 0.2} />
                <stop offset='100%' stopColor={color} stopOpacity='0' />
              </radialGradient>
            </defs>
            <circle cx='40' cy='40' r='38' fill={`url(#hero-glow-${cubeKey})`} />
            {/* mode ring outline */}
            <circle
              cx='40'
              cy='40'
              r='36'
              fill='none'
              stroke={color}
              strokeWidth='1'
              strokeOpacity='0.4'
              strokeDasharray='2 4'
            />
          </svg>
          <Image
            src={`/aio/dashboard/cube_${cubeKey}.png`}
            alt={title}
            fill
            sizes='80px'
            className='object-contain'
            style={{ filter: dropShadow }}
          />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span
              className='text-lg font-semibold text-white'
              style={{ textShadow: 'var(--aio-text-glow)' }}
            >
              {title}
            </span>
            {mode !== undefined && mode !== null ? (
              <span
                className='rounded px-1.5 py-0.5 text-[10px] font-medium'
                style={{
                  background: `${color}26`,
                  color,
                  boxShadow: `0 0 8px ${color}66`,
                }}
              >
                {modeLabel(mode)}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div className='mt-0.5 text-xs text-[var(--aio-subtitle)]'>{subtitle}</div>
          ) : null}
        </div>
      </div>
    </AioPanel>
  )
}

function modeLabel(mode: number) {
  return mode === 0 ? 'AI분석' : mode === 1 ? '부분AI' : mode === 2 ? 'AI' : '-'
}

function alphaHex(strength: number) {
  const a = Math.round(Math.max(0, Math.min(1, strength)) * 255)
  return a.toString(16).padStart(2, '0')
}
