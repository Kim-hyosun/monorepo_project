'use client'

import { useEffect, useMemo, useState } from 'react'

import { AioPanel } from '@/shared/components/AioPanel'
import type { EmsLatest } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  latest: EmsLatest
}

interface Tab {
  key: string
  label: string
  group: 'pt' | 'ss' // 평택 / 송산
  current: number | null
  ai: number | null
}

export function PumpStatusCarousel({ latest }: Props) {
  const { pump } = latest

  const tabs: Tab[] = useMemo(
    () => [
      { key: 'pt1', label: '평택 1', group: 'pt', current: pump.h1_pm1, ai: pump.ai_h1_pm1 },
      { key: 'pt2', label: '평택 2', group: 'pt', current: pump.h1_pm2, ai: pump.ai_h1_pm2 },
      { key: 'pt3', label: '평택 3', group: 'pt', current: pump.h1_pm3, ai: pump.ai_h1_pm3 },
      { key: 'pt4', label: '평택 4', group: 'pt', current: pump.h1_pm4, ai: pump.ai_h1_pm4 },
      { key: 'ss1', label: '송산 1', group: 'ss', current: pump.h2_pm1, ai: pump.ai_h2_pm1 },
      { key: 'ss2', label: '송산 2', group: 'ss', current: pump.h2_pm2, ai: pump.ai_h2_pm2 },
    ],
    [pump],
  )

  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0]

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveKey((k) => {
        const i = tabs.findIndex((t) => t.key === k)
        return tabs[(i + 1) % tabs.length].key
      })
    }, 4_000)
    return () => window.clearInterval(id)
  }, [tabs])

  const pt = tabs.filter((t) => t.group === 'pt')
  const ss = tabs.filter((t) => t.group === 'ss')

  return (
    <AioPanel className='p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <a
          href='/analysis'
          className='text-sm font-semibold text-white hover:underline'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          펌프현황
        </a>
        <div className='flex gap-3'>
          <Group label='평택' tabs={pt} activeKey={activeKey} onSelect={setActiveKey} />
          <Group label='송산' tabs={ss} activeKey={activeKey} onSelect={setActiveKey} />
        </div>
      </div>
      <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
        <div className='flex items-baseline justify-between'>
          <div className='text-xs text-[var(--aio-subtitle)]'>{active.label} 계통</div>
          <div
            className='text-2xl font-semibold text-white'
            style={{ textShadow: 'var(--aio-text-glow)' }}
          >
            {active.current === null ? '-' : active.current.toLocaleString()}
            <span className='ml-1 text-sm text-[var(--aio-subtitle)]'>kW</span>
          </div>
        </div>
        <div className='mt-2 flex items-baseline justify-between'>
          <div className='text-xs text-[var(--aio-subtitle)]'>AI 추천</div>
          <div className='text-lg font-semibold text-emerald-300'>
            {active.ai === null ? '-' : active.ai.toLocaleString()}
            <span className='ml-1 text-xs text-[var(--aio-subtitle)]'>kW</span>
          </div>
        </div>
        <div className='mt-3 grid grid-cols-6 gap-1'>
          {tabs.map((t) => (
            <div
              key={t.key}
              className={cn(
                'h-1.5 rounded-full',
                t.key === activeKey ? 'bg-[var(--aio-accent)]' : 'bg-white/10',
              )}
            />
          ))}
        </div>
      </div>
    </AioPanel>
  )
}

function Group({
  label,
  tabs,
  activeKey,
  onSelect,
}: {
  label: string
  tabs: Tab[]
  activeKey: string
  onSelect: (k: string) => void
}) {
  return (
    <div className='flex items-center gap-1'>
      <span className='mr-1 text-xs text-[var(--aio-subtitle)]'>{label}</span>
      {tabs.map((t) => {
        const active = t.key === activeKey
        const off = t.current === null || t.current === 0
        return (
          <button
            key={t.key}
            type='button'
            onClick={() => onSelect(t.key)}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded text-xs font-medium transition',
              active
                ? 'bg-[var(--aio-accent)]/40 text-white'
                : off
                  ? 'bg-white/5 text-white/40'
                  : 'bg-white/10 text-white/80 hover:bg-white/20',
            )}
          >
            {t.label.replace(/\D/g, '')}
          </button>
        )
      })}
    </div>
  )
}
