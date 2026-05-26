'use client'

import type { ElementCount, ElementItem, ElementsShape } from '@/lib/types'

interface Props {
  elements?: Record<string, unknown>
}

const ELEMENT_META: { key: keyof ElementsShape; ko: string; hanja: string; cssVar: string }[] = [
  { key: 'wood', ko: '목', hanja: '木', cssVar: '--element-wood' },
  { key: 'fire', ko: '화', hanja: '火', cssVar: '--element-fire' },
  { key: 'earth', ko: '토', hanja: '土', cssVar: '--element-earth' },
  { key: 'metal', ko: '금', hanja: '金', cssVar: '--element-metal' },
  { key: 'water', ko: '수', hanja: '水', cssVar: '--element-water' },
]

export function FiveElementsChart({ elements }: Props) {
  if (!elements) return null
  const counts = normalize(elements)
  if (!counts) {
    return (
      <div>
        <h3 className='mb-2 text-base font-semibold'>오행 분포</h3>
        <pre className='bg-muted text-muted-foreground overflow-auto rounded-md p-3 text-[11px]'>
          {JSON.stringify(elements, null, 2)}
        </pre>
      </div>
    )
  }

  const total = sum(counts, 'total')
  const skyTotal = sum(counts, 'skyOnly')
  const earthTotal = sum(counts, 'earthOnly')
  const safeTotal = total > 0 ? total : 1
  const R = 60
  const C = 2 * Math.PI * R
  let acc = 0

  return (
    <div className='bg-card text-card-foreground space-y-5 rounded-xl border p-5 shadow-sm'>
      <h3 className='text-base font-semibold'>오행 분포</h3>

      <div className='grid items-center gap-6 sm:grid-cols-[180px_1fr]'>
        <div className='relative mx-auto h-[160px] w-[160px]'>
          <svg viewBox='0 0 160 160' className='size-full -rotate-90'>
            <circle
              cx='80'
              cy='80'
              r={R}
              fill='none'
              stroke='var(--muted)'
              strokeWidth='18'
              opacity='0.4'
            />
            {ELEMENT_META.map((meta) => {
              const v = counts[meta.key].total.count
              const seg = (v / safeTotal) * C
              const dasharray = `${seg} ${C - seg}`
              const offset = -acc
              acc += seg
              return (
                <circle
                  key={meta.key}
                  cx='80'
                  cy='80'
                  r={R}
                  fill='none'
                  stroke={`var(${meta.cssVar})`}
                  strokeWidth='18'
                  strokeDasharray={dasharray}
                  strokeDashoffset={offset}
                  strokeLinecap='butt'
                />
              )
            })}
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-muted-foreground text-[10px]'>총</span>
            <span className='text-2xl font-bold leading-none'>{total}</span>
          </div>
        </div>

        <ul className='space-y-2'>
          {ELEMENT_META.map((meta) => {
            const item = counts[meta.key]
            return (
              <li key={meta.key} className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='flex items-center gap-2'>
                    <span
                      className='inline-block size-2.5 rounded-full'
                      style={{ background: `var(${meta.cssVar})` }}
                    />
                    <span className='font-medium'>
                      {meta.ko} <span className='text-muted-foreground'>{meta.hanja}</span>
                    </span>
                  </span>
                  <span className='text-muted-foreground'>
                    <span className='text-foreground font-semibold'>{item.total.count}</span>
                    <span className='ml-1 text-[10px]'>({item.total.percentage.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className='bg-muted h-1.5 w-full overflow-hidden rounded-full'>
                  <div
                    className='h-full rounded-full transition-[width] duration-500'
                    style={{ width: `${item.total.percentage}%`, background: `var(${meta.cssVar})` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* skyOnly / earthOnly 세부 분포 */}
      <div className='border-t pt-4'>
        <div className='text-muted-foreground mb-2 text-xs font-medium'>천간 / 지지 세부 분포</div>
        <div className='grid grid-cols-5 gap-2'>
          {ELEMENT_META.map((meta) => {
            const item = counts[meta.key]
            return (
              <div
                key={meta.key}
                className='bg-background/60 flex flex-col items-center gap-1 rounded-md border p-2 text-[11px]'
              >
                <span
                  className='font-semibold'
                  style={{ color: `var(${meta.cssVar})` }}
                >
                  {meta.ko}
                </span>
                <div className='flex flex-col items-center'>
                  <span className='text-muted-foreground text-[9px]'>천간</span>
                  <span className='text-foreground font-medium'>{item.skyOnly?.count ?? 0}</span>
                  <span className='text-muted-foreground text-[9px]'>
                    {(item.skyOnly?.percentage ?? 0).toFixed(0)}%
                  </span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-muted-foreground text-[9px]'>지지</span>
                  <span className='text-foreground font-medium'>{item.earthOnly?.count ?? 0}</span>
                  <span className='text-muted-foreground text-[9px]'>
                    {(item.earthOnly?.percentage ?? 0).toFixed(0)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className='text-muted-foreground mt-2 flex justify-end gap-3 text-[10px]'>
          <span>천간 총 {skyTotal}</span>
          <span>지지 총 {earthTotal}</span>
        </div>
      </div>
    </div>
  )
}

function sum(counts: ElementsShape, kind: 'total' | 'skyOnly' | 'earthOnly'): number {
  return ELEMENT_META.reduce((acc, meta) => {
    const item = counts[meta.key][kind]
    return acc + (item?.count ?? 0)
  }, 0)
}

function normalize(raw: Record<string, unknown>): ElementsShape | null {
  const out: Partial<ElementsShape> = {}
  for (const key of ['wood', 'fire', 'earth', 'metal', 'water'] as const) {
    const v = raw[key]
    if (v && typeof v === 'object') {
      const item = extractItem(v as Record<string, unknown>)
      if (item) out[key] = item
    }
  }
  if (!out.wood || !out.fire || !out.earth || !out.metal || !out.water) return null
  return out as ElementsShape
}

function extractItem(v: Record<string, unknown>): ElementItem | null {
  const total = extractCount(v.total)
  if (!total) return null
  return {
    name: typeof v.name === 'string' ? v.name : undefined,
    total,
    skyOnly: extractCount(v.skyOnly),
    earthOnly: extractCount(v.earthOnly),
  }
}

function extractCount(v: unknown): ElementCount | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const count = typeof o.count === 'number' ? o.count : undefined
  const percentage = typeof o.percentage === 'number' ? o.percentage : 0
  if (count === undefined) return undefined
  return { count, percentage }
}
