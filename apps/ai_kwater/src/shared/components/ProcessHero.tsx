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

interface Props {
  cubeKey: ProcessCubeKey
  title: string
  subtitle?: string
  className?: string
}

/**
 * 공정 페이지 상단 다크 hero — cube_<key>.png 큐브 이미지 + 제목 + 부제목.
 * AioPanel 안에 좌측 cube · 우측 텍스트 + waterwall_back 의 미세 오버레이.
 */
export function ProcessHero({ cubeKey, title, subtitle, className }: Props) {
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
          <Image
            src={`/aio/dashboard/cube_${cubeKey}.png`}
            alt={title}
            fill
            sizes='80px'
            className='object-contain drop-shadow-[0_0_18px_rgba(92,175,255,0.65)]'
          />
        </div>
        <div className='min-w-0'>
          <div
            className='text-lg font-semibold text-white'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            {title}
          </div>
          {subtitle ? (
            <div className='mt-0.5 text-xs text-[var(--aio-subtitle)]'>{subtitle}</div>
          ) : null}
        </div>
      </div>
    </AioPanel>
  )
}
