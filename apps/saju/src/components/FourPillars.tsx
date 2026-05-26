'use client'

import { Card, CardContent } from '@/shared/ui/card'
import type {
  FourPillarItem,
  FourPillarsShape,
  JiJangGanItem,
  TwelveFortuneInterpretation,
} from '@/lib/types'

interface Props {
  pillars?: Record<string, unknown>
}

const LABELS: { key: keyof FourPillarsShape; ko: string }[] = [
  { key: 'year', ko: '연주' },
  { key: 'month', ko: '월주' },
  { key: 'day', ko: '일주' },
  { key: 'hour', ko: '시주' },
]

const ELEMENT_VAR: Record<string, string> = {
  목: '--element-wood',
  화: '--element-fire',
  토: '--element-earth',
  금: '--element-metal',
  수: '--element-water',
}

export function FourPillars({ pillars }: Props) {
  if (!pillars) return null
  const shape = normalize(pillars)
  if (!shape) {
    return (
      <Card>
        <CardContent className='pt-5'>
          <h3 className='mb-2 text-sm font-semibold'>사주 원국</h3>
          <pre className='bg-muted text-muted-foreground overflow-auto rounded-md p-3 text-[11px]'>
            {JSON.stringify(pillars, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }
  return (
    <div>
      <h3 className='mb-3 text-base font-semibold'>사주 원국</h3>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
        {LABELS.map(({ key, ko }) => {
          const p = shape[key]
          return (
            <Card key={key} className='from-primary/8 to-card bg-gradient-to-b'>
              <CardContent className='space-y-3 pt-5 pb-5'>
                <div className='text-muted-foreground text-center text-xs'>{ko}</div>
                {p ? <PillarBlock pillar={p} /> : <div className='text-muted-foreground text-center'>—</div>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function PillarBlock({ pillar }: { pillar: FourPillarItem }) {
  const skyColor = pillar.skyElement ? `var(${ELEMENT_VAR[pillar.skyElement] ?? '--foreground'})` : undefined
  const earthColor = pillar.earthElement
    ? `var(${ELEMENT_VAR[pillar.earthElement] ?? '--foreground'})`
    : undefined
  return (
    <div className='space-y-3'>
      {/* 천간/지지 큰 글자 */}
      <div className='flex flex-col items-center gap-0.5 leading-none'>
        <span
          className='text-3xl font-bold tracking-tight'
          style={skyColor ? { color: skyColor } : undefined}
        >
          {pillar.sky || '?'}
        </span>
        <span
          className='text-2xl font-semibold'
          style={earthColor ? { color: earthColor } : undefined}
        >
          {pillar.earth || '?'}
        </span>
      </div>

      {/* skyFull/earthFull (오행 풀명) */}
      {pillar.skyFull || pillar.earthFull ? (
        <div className='text-muted-foreground flex justify-center gap-2 text-[11px]'>
          {pillar.skyFull ? <span>{pillar.skyFull}</span> : null}
          {pillar.skyFull && pillar.earthFull ? <span>·</span> : null}
          {pillar.earthFull ? <span>{pillar.earthFull}</span> : null}
        </div>
      ) : null}

      {/* 십신 / 12운성 / 납음 칩 */}
      <div className='flex flex-wrap justify-center gap-1'>
        {pillar.sippiSeong ? <Chip tone='muted' label='십신(천)' value={pillar.sippiSeong} /> : null}
        {pillar.earthSippiSeong ? (
          <Chip tone='muted' label='십신(지)' value={pillar.earthSippiSeong} />
        ) : null}
        {pillar.twelveStage ? <Chip tone='accent' label='12운성' value={pillar.twelveStage} /> : null}
        {pillar.naeeum ? <Chip tone='primary' label='납음' value={pillar.naeeum} /> : null}
      </div>

      {/* 지장간 */}
      {pillar.jiJangGan ? <JiJangGanBlock jjg={pillar.jiJangGan} /> : null}

      {/* 12운성 해석 */}
      {pillar.twelveFortuneInterpretation ? (
        <TwelveFortuneBlock data={pillar.twelveFortuneInterpretation} />
      ) : null}
    </div>
  )
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'muted' | 'accent' | 'primary'
}) {
  const cls =
    tone === 'primary'
      ? 'bg-primary/15 text-primary'
      : tone === 'accent'
        ? 'bg-accent text-accent-foreground'
        : 'bg-muted text-muted-foreground'
  return (
    <span className={`${cls} rounded px-1.5 py-0.5 text-[10px]`}>
      <span className='opacity-70'>{label}</span>{' '}
      <span className='font-semibold'>{value}</span>
    </span>
  )
}

function JiJangGanBlock({ jjg }: { jjg: JiJangGanItem }) {
  const rows: { ko: string; data?: { stem: string; days: number } }[] = [
    { ko: '잔기', data: jjg.residue },
    { ko: '중기', data: jjg.middle },
    { ko: '정기', data: jjg.main },
  ]
  if (rows.every((r) => !r.data)) return null
  const totalDays = rows.reduce((acc, r) => acc + (r.data?.days ?? 0), 0)
  return (
    <div className='bg-background/60 rounded-md border p-2'>
      <div className='text-muted-foreground mb-1.5 text-[10px] font-medium'>지장간</div>
      <div className='space-y-1'>
        {rows.map(
          (r) =>
            r.data && (
              <div key={r.ko} className='flex items-center gap-1.5 text-[11px]'>
                <span className='text-muted-foreground w-7 shrink-0'>{r.ko}</span>
                <span className='text-foreground w-4 shrink-0 font-semibold'>{r.data.stem}</span>
                <div className='bg-muted h-1 flex-1 overflow-hidden rounded-full'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{ width: `${(r.data.days / Math.max(totalDays, 1)) * 100}%` }}
                  />
                </div>
                <span className='text-muted-foreground w-6 shrink-0 text-right text-[9px]'>
                  {r.data.days}일
                </span>
              </div>
            )
        )}
      </div>
    </div>
  )
}

function TwelveFortuneBlock({ data }: { data: TwelveFortuneInterpretation }) {
  return (
    <div className='bg-accent/30 rounded-md border p-2 text-[11px]'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground font-semibold'>{data.keyword}</span>
        <span className='text-muted-foreground text-[10px]'>
          Lv. <span className='text-foreground font-semibold'>{data.level}</span>
        </span>
      </div>
      <div className='text-muted-foreground mt-1 leading-snug'>{data.energy}</div>
      {data.positionMeaning ? (
        <div className='text-foreground/80 mt-1 leading-snug'>{data.positionMeaning}</div>
      ) : null}
    </div>
  )
}

function normalize(raw: Record<string, unknown>): FourPillarsShape | null {
  const out: Partial<FourPillarsShape> = {}
  for (const key of ['year', 'month', 'day', 'hour'] as const) {
    const v = raw[key]
    if (v && typeof v === 'object') {
      const item = extractItem(v as Record<string, unknown>)
      if (item) out[key] = item
    }
  }
  if (!out.year || !out.month || !out.day) return null
  return out as FourPillarsShape
}

function extractItem(v: Record<string, unknown>): FourPillarItem | null {
  const sky = str(v.sky) ?? str(v.stem)
  const earth = str(v.earth) ?? str(v.branch)
  const full = str(v.full) ?? str(v.label) ?? str(v.name)
  if (!sky && !earth && !full) return null
  return {
    full: full ?? `${sky ?? ''}${earth ?? ''}`,
    sky: sky ?? '',
    earth: earth ?? '',
    skyElement: str(v.skyElement),
    earthElement: str(v.earthElement),
    skyFull: str(v.skyFull),
    earthFull: str(v.earthFull),
    sippiSeong: str(v.sippiSeong) ?? str(v.sipseong),
    earthSippiSeong: str(v.earthSippiSeong),
    twelveStage: str(v.twelveStage),
    naeeum: str(v.naeeum),
    jiJangGan: extractJjg(v.jiJangGan),
    twelveFortuneInterpretation: extractTwelve(v.twelveFortuneInterpretation),
  }
}

function extractJjg(v: unknown): JiJangGanItem | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const r: JiJangGanItem = {}
  r.residue = extractStemDays(o.residue)
  r.middle = extractStemDays(o.middle)
  r.main = extractStemDays(o.main)
  if (!r.residue && !r.middle && !r.main) return undefined
  return r
}

function extractStemDays(v: unknown): { stem: string; days: number } | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const stem = str(o.stem)
  const days = typeof o.days === 'number' ? o.days : undefined
  if (!stem || days === undefined) return undefined
  return { stem, days }
}

function extractTwelve(v: unknown): TwelveFortuneInterpretation | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const keyword = str(o.keyword)
  const energy = str(o.energy)
  const level = typeof o.level === 'number' ? o.level : undefined
  if (!keyword || !energy || level === undefined) return undefined
  return { keyword, energy, level, positionMeaning: str(o.positionMeaning) }
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined
}
