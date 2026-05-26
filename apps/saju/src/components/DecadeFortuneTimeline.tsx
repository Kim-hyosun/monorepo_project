'use client'

import { useState } from 'react'

import type { DecadeFortuneShape, DecadeItem } from '@/lib/types'

interface Props {
  decadeFortune?: Record<string, unknown>
  currentAge?: number
}

const ELEMENT_VAR: Record<string, string> = {
  목: '--element-wood',
  화: '--element-fire',
  토: '--element-earth',
  금: '--element-metal',
  수: '--element-water',
}

/**
 * 대운 timeline — 13개 대운 가로 스크롤 카드, 현재 나이 강조.
 * 카드 클릭 시 상세 (12운성 keyword, 십신 분류) 펼침.
 */
export function DecadeFortuneTimeline({ decadeFortune, currentAge }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  if (!decadeFortune) return null
  const shape = normalize(decadeFortune)
  if (!shape || shape.list.length === 0) return null

  const currentIdx = currentAge !== undefined ? findCurrentIdx(shape.list, currentAge) : -1

  return (
    <div className='bg-card text-card-foreground rounded-xl border p-5 shadow-sm'>
      <div className='mb-3 flex items-start justify-between'>
        <h3 className='text-base font-semibold'>대운 (10년 단위)</h3>
        <div className='text-muted-foreground text-right text-[10px]'>
          <div>방향: {shape.direction}</div>
          {shape.basisTermsName ? <div>기준: {shape.basisTermsName}</div> : null}
          {shape.basisDuration ? <div>주기: {shape.basisDuration}</div> : null}
          {shape.startDateTime ? <div className='whitespace-nowrap'>시작 {shape.startDateTime}</div> : null}
        </div>
      </div>

      <div className='flex gap-2 overflow-x-auto pb-2'>
        {shape.list.map((d, i) => {
          const isCurrent = i === currentIdx
          const isOpen = openIdx === i
          const skyColor = d.skyElement ? `var(${ELEMENT_VAR[d.skyElement] ?? '--foreground'})` : undefined
          const earthColor = d.earthElement
            ? `var(${ELEMENT_VAR[d.earthElement] ?? '--foreground'})`
            : undefined
          return (
            <button
              key={d.index}
              type='button'
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className={`group/decade flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-md border p-2 text-center transition-all ${
                isCurrent
                  ? 'border-primary bg-primary/10 shadow-md'
                  : isOpen
                    ? 'border-accent-foreground/30 bg-accent/40'
                    : 'bg-background/40 hover:border-primary/30'
              }`}
              style={{ minWidth: 84 }}
            >
              <span className='text-muted-foreground text-[10px]'>{d.startAge}세~</span>
              <div className='flex flex-col items-center leading-none'>
                <span
                  className='text-xl font-bold'
                  style={skyColor ? { color: skyColor } : undefined}
                >
                  {d.sky}
                </span>
                <span
                  className='text-lg font-semibold'
                  style={earthColor ? { color: earthColor } : undefined}
                >
                  {d.earth}
                </span>
              </div>
              {isCurrent ? (
                <span className='bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[8px] font-medium'>
                  현재
                </span>
              ) : null}
              {d.twelveFortune ? (
                <span className='text-muted-foreground text-[9px]'>{d.twelveFortune.name}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* 상세 패널 */}
      {openIdx !== null && shape.list[openIdx] ? (
        <DecadeDetailPanel decade={shape.list[openIdx]} />
      ) : (
        <div className='text-muted-foreground mt-2 text-center text-[11px]'>
          카드를 클릭하면 상세 해석이 표시됩니다
        </div>
      )}
    </div>
  )
}

function DecadeDetailPanel({ decade }: { decade: DecadeItem }) {
  return (
    <div className='bg-background/50 mt-3 grid gap-3 rounded-md border p-3 text-sm sm:grid-cols-2'>
      <div>
        <div className='text-muted-foreground mb-1 text-xs'>대운주</div>
        <div className='flex items-baseline gap-2'>
          <span className='text-xl font-bold'>{decade.full}</span>
          <span className='text-muted-foreground text-xs'>{decade.startAge}세부터</span>
        </div>
        {decade.skyFull || decade.earthFull ? (
          <div className='text-muted-foreground mt-1 text-[11px]'>
            {decade.skyFull} · {decade.earthFull}
          </div>
        ) : null}
      </div>
      <div className='space-y-1'>
        {decade.sipseong ? (
          <div className='flex justify-between text-[11px]'>
            <span className='text-muted-foreground'>십신</span>
            <span>
              <span className='font-semibold'>{decade.sipseong.gan}</span>{' '}
              <span className='text-muted-foreground'>({decade.sipseong.ganCategory})</span>
            </span>
          </div>
        ) : null}
        {decade.twelveFortune ? (
          <>
            <div className='flex justify-between text-[11px]'>
              <span className='text-muted-foreground'>12운성</span>
              <span>
                <span className='font-semibold'>{decade.twelveFortune.name}</span>
                <span className='text-muted-foreground ml-1'>Lv. {decade.twelveFortune.level}</span>
              </span>
            </div>
            <div className='bg-accent/40 mt-1 rounded px-2 py-1 text-[11px]'>
              {decade.twelveFortune.keyword}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function findCurrentIdx(list: DecadeItem[], age: number): number {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].startAge <= age) return i
  }
  return -1
}

function normalize(raw: Record<string, unknown>): DecadeFortuneShape | null {
  const list = Array.isArray(raw.list) ? raw.list : []
  const items = list.map((v) => (v && typeof v === 'object' ? extractItem(v as Record<string, unknown>) : null)).filter(
    (x): x is DecadeItem => x !== null
  )
  if (items.length === 0) return null
  return {
    direction: typeof raw.direction === 'string' ? raw.direction : '',
    startAge: typeof raw.startAge === 'number' ? raw.startAge : 0,
    startDateTime: typeof raw.startDateTime === 'string' ? raw.startDateTime : undefined,
    basisTermsName: typeof raw.basisTermsName === 'string' ? raw.basisTermsName : undefined,
    basisDuration: typeof raw.basisDuration === 'string' ? raw.basisDuration : undefined,
    list: items,
  }
}

function extractItem(v: Record<string, unknown>): DecadeItem | null {
  const sky = typeof v.sky === 'string' ? v.sky : ''
  const earth = typeof v.earth === 'string' ? v.earth : ''
  const full = typeof v.full === 'string' ? v.full : `${sky}${earth}`
  const startAge = typeof v.startAge === 'number' ? v.startAge : -1
  const index = typeof v.index === 'number' ? v.index : 0
  if (startAge < 0 || (!sky && !earth)) return null
  const sip = v.sipseong as Record<string, unknown> | undefined
  const tw = v.twelveFortune as Record<string, unknown> | undefined
  return {
    index,
    startAge,
    full,
    sky,
    earth,
    skyElement: typeof v.skyElement === 'string' ? v.skyElement : undefined,
    earthElement: typeof v.earthElement === 'string' ? v.earthElement : undefined,
    skyFull: typeof v.skyFull === 'string' ? v.skyFull : undefined,
    earthFull: typeof v.earthFull === 'string' ? v.earthFull : undefined,
    sipseong:
      sip && typeof sip === 'object' && typeof sip.gan === 'string' && typeof sip.ganCategory === 'string'
        ? { gan: sip.gan, ganCategory: sip.ganCategory }
        : undefined,
    twelveFortune:
      tw &&
      typeof tw === 'object' &&
      typeof tw.name === 'string' &&
      typeof tw.keyword === 'string' &&
      typeof tw.level === 'number'
        ? { name: tw.name, keyword: tw.keyword, level: tw.level }
        : undefined,
  }
}
