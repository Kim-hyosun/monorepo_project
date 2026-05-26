'use client'

import { Sparkles, Check, X } from 'lucide-react'

import type { SinStrengthShape, SummaryShape } from '@/lib/types'

interface Props {
  summary?: Record<string, unknown>
  sinStrength?: Record<string, unknown>
}

const ELEMENT_VAR: Record<string, string> = {
  목: '--element-wood',
  화: '--element-fire',
  토: '--element-earth',
  금: '--element-metal',
  수: '--element-water',
}

export function AnalysisSummary({ summary, sinStrength }: Props) {
  const s = summary ? extractSummary(summary) : null
  const strength = sinStrength ? extractStrength(sinStrength) : null
  if (!s && !strength) return null

  return (
    <div className='from-accent/40 to-card text-card-foreground space-y-4 rounded-xl border bg-gradient-to-br p-5 shadow-sm'>
      <div className='flex items-center gap-2'>
        <Sparkles className='text-primary size-4' />
        <h3 className='text-base font-semibold'>분석 요약</h3>
      </div>

      {/* 일간 + 기세 */}
      <div className='grid gap-3 sm:grid-cols-2'>
        {s?.dayMaster ? (
          <Tile
            label='일간 (나)'
            value={
              <span>
                <span
                  className='text-2xl font-bold'
                  style={{ color: `var(${ELEMENT_VAR[s.dayMaster.element] ?? '--foreground'})` }}
                >
                  {s.dayMaster.char}
                </span>
                <span className='text-muted-foreground ml-2 text-sm'>{s.dayMaster.element}</span>
              </span>
            }
          />
        ) : null}
        {strength ? (
          <Tile
            label='기세'
            value={
              <span className='flex items-baseline gap-2'>
                <span className='text-2xl font-bold'>{strength.strength}</span>
                <span className='text-muted-foreground text-xs'>{strength.score}점</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    strength.isStrong
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {strength.isStrong ? '신강' : '신약/중화'}
                </span>
              </span>
            }
          />
        ) : null}
      </div>

      {/* 득령/득지/득세 + 카운트 */}
      {strength &&
      (strength.deukryeong !== undefined ||
        strength.deukji !== undefined ||
        strength.deukse !== undefined ||
        strength.bigyeopCount !== undefined ||
        strength.inseongCount !== undefined) ? (
        <div className='bg-background/50 space-y-2 rounded-md border p-3'>
          <div className='text-xs font-medium'>득력 분석</div>
          <div className='grid grid-cols-3 gap-2 text-[11px]'>
            <DeukItem label='득령' value={strength.deukryeong} description='월령 기준' />
            <DeukItem label='득지' value={strength.deukji} description='일지 기준' />
            <DeukItem label='득세' value={strength.deukse} description='주변 다수' />
          </div>
          {strength.bigyeopCount !== undefined || strength.inseongCount !== undefined ? (
            <div className='text-muted-foreground flex gap-4 text-[11px]'>
              {strength.bigyeopCount !== undefined ? (
                <span>
                  비겁 <span className='text-foreground font-semibold'>{strength.bigyeopCount}</span>
                </span>
              ) : null}
              {strength.inseongCount !== undefined ? (
                <span>
                  인성 <span className='text-foreground font-semibold'>{strength.inseongCount}</span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 오행 균형 */}
      {s?.elementBalance ? (
        <div className='bg-background/50 rounded-md border p-3'>
          <div className='mb-1.5 flex items-center justify-between text-xs'>
            <span className='font-medium'>오행 균형</span>
            <span className='text-muted-foreground'>
              <span className='text-foreground font-semibold'>{s.elementBalance.score}</span>
              <span className='ml-1'>· 등급 {s.elementBalance.grade}</span>
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs'>
            <span>
              <span className='text-muted-foreground'>강한 오행</span>{' '}
              <span
                className='font-semibold'
                style={{ color: `var(${ELEMENT_VAR[s.elementBalance.dominant] ?? '--foreground'})` }}
              >
                {s.elementBalance.dominant}
              </span>
            </span>
            <span>
              <span className='text-muted-foreground'>부족 오행</span>{' '}
              {s.elementBalance.lacking ? (
                <span
                  className='font-semibold'
                  style={{
                    color: `var(${ELEMENT_VAR[s.elementBalance.lacking] ?? '--foreground'})`,
                  }}
                >
                  {s.elementBalance.lacking}
                </span>
              ) : (
                <span className='text-muted-foreground'>없음</span>
              )}
            </span>
          </div>
        </div>
      ) : null}

      {/* 합 / 충 */}
      {s?.harmony || s?.conflict ? (
        <div className='grid gap-2 sm:grid-cols-2'>
          {s?.harmony ? (
            <MiniStat tone='positive' label='합 (조화)' value={s.harmony.label} grade={s.harmony.grade} />
          ) : null}
          {s?.conflict ? (
            <MiniStat tone='negative' label='충 (갈등)' value={s.conflict.label} grade={s.conflict.grade} />
          ) : null}
        </div>
      ) : null}

      {/* 길신/흉신 */}
      {s?.positiveSpirits || s?.negativeSpirits ? (
        <div className='grid gap-2 sm:grid-cols-2'>
          {s?.positiveSpirits && s.positiveSpirits.count > 0 ? (
            <SpiritsList tone='positive' label='길신' data={s.positiveSpirits} />
          ) : null}
          {s?.negativeSpirits && s.negativeSpirits.count > 0 ? (
            <SpiritsList tone='negative' label='흉신' data={s.negativeSpirits} />
          ) : null}
        </div>
      ) : null}

      {/* 대운 phase */}
      {s?.fortunePhase ? (
        <div className='bg-background/50 rounded-md border p-3 text-xs'>
          <div className='mb-1.5 font-medium'>대운 흐름</div>
          <div className='flex flex-wrap items-center gap-4'>
            {s.fortunePhase.current ? (
              <PhaseChip label='현재' {...s.fortunePhase.current} />
            ) : null}
            {s.fortunePhase.next ? (
              <>
                <span className='text-muted-foreground'>→</span>
                <PhaseChip label='다음' {...s.fortunePhase.next} />
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 분석 텍스트 */}
      {strength?.analysis ? (
        <p className='text-foreground text-sm leading-relaxed whitespace-pre-line'>
          {strength.analysis}
        </p>
      ) : strength?.description ? (
        <p className='text-muted-foreground text-sm'>{strength.description}</p>
      ) : null}
    </div>
  )
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='bg-background/50 rounded-md border p-3'>
      <div className='text-muted-foreground mb-1 text-xs'>{label}</div>
      <div>{value}</div>
    </div>
  )
}

function DeukItem({ label, value, description }: { label: string; value?: boolean; description: string }) {
  const hit = value === true
  return (
    <div
      className={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 ${
        hit ? 'border-emerald-300/50 bg-emerald-50 dark:border-emerald-700/50 dark:bg-emerald-900/20' : 'bg-background/40'
      }`}
    >
      <div className='flex items-center gap-1'>
        {hit ? (
          <Check className='size-3 text-emerald-600 dark:text-emerald-400' />
        ) : (
          <X className='size-3 text-muted-foreground/60' />
        )}
        <span className={hit ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}>
          {label}
        </span>
      </div>
      <span className='text-muted-foreground text-[9px]'>{description}</span>
    </div>
  )
}

function MiniStat({
  tone,
  label,
  value,
  grade,
}: {
  tone: 'positive' | 'negative'
  label: string
  value: string
  grade: string
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-xs ${
        tone === 'positive'
          ? 'border-emerald-300/50 bg-emerald-50 dark:border-emerald-700/50 dark:bg-emerald-900/20'
          : 'border-rose-300/50 bg-rose-50 dark:border-rose-700/50 dark:bg-rose-900/20'
      }`}
    >
      <div className='mb-0.5 flex items-center justify-between'>
        <span className='font-medium'>{label}</span>
        <span className='text-muted-foreground'>등급 {grade}</span>
      </div>
      <div className='text-foreground'>{value}</div>
    </div>
  )
}

function SpiritsList({
  tone,
  label,
  data,
}: {
  tone: 'positive' | 'negative'
  label: string
  data: { count: number; notable: string[] }
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-xs ${
        tone === 'positive'
          ? 'border-emerald-300/50 bg-emerald-50/60 dark:border-emerald-700/50 dark:bg-emerald-900/15'
          : 'border-rose-300/50 bg-rose-50/60 dark:border-rose-700/50 dark:bg-rose-900/15'
      }`}
    >
      <div className='mb-1 flex items-center justify-between'>
        <span className='font-medium'>{label}</span>
        <span className='text-muted-foreground'>{data.count}개</span>
      </div>
      <div className='flex flex-wrap gap-1'>
        {data.notable.map((n) => (
          <span key={n} className='bg-background rounded border px-1.5 py-0.5 text-[10px]'>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

function PhaseChip({
  label,
  age,
  pillar,
  element,
}: {
  label: string
  age: number
  pillar: string
  element: string
}) {
  return (
    <div>
      <div className='text-muted-foreground text-[10px]'>{label}</div>
      <div className='flex items-baseline gap-1.5'>
        <span className='font-semibold'>{age}세</span>
        <span className='text-primary font-medium'>{pillar}</span>
        <span className='text-muted-foreground text-[10px]'>{element}</span>
      </div>
    </div>
  )
}

function extractSummary(raw: Record<string, unknown>): SummaryShape | null {
  const out: SummaryShape = {}
  out.dayMaster = extractDayMaster(raw.dayMaster)
  out.elementBalance = extractElementBalance(raw.elementBalance)
  out.harmony = extractScored(raw.harmony)
  out.conflict = extractScored(raw.conflict)
  out.positiveSpirits = extractSpirits(raw.positiveSpirits)
  out.negativeSpirits = extractSpirits(raw.negativeSpirits)
  out.fortunePhase = extractFortunePhase(raw.fortunePhase)
  if (
    !out.dayMaster &&
    !out.elementBalance &&
    !out.harmony &&
    !out.conflict &&
    !out.positiveSpirits &&
    !out.negativeSpirits &&
    !out.fortunePhase
  ) {
    return null
  }
  return out
}

function extractDayMaster(v: unknown): SummaryShape['dayMaster'] | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const char = typeof o.char === 'string' ? o.char : undefined
  const element = typeof o.element === 'string' ? o.element : undefined
  if (!char || !element) return undefined
  return { char, element }
}

function extractElementBalance(v: unknown): SummaryShape['elementBalance'] | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const dominant = typeof o.dominant === 'string' ? o.dominant : undefined
  const lacking = typeof o.lacking === 'string' ? o.lacking : o.lacking === null ? null : undefined
  const score = typeof o.score === 'number' ? o.score : undefined
  const grade = typeof o.grade === 'string' ? o.grade : undefined
  if (!dominant || score === undefined || !grade) return undefined
  return { dominant, lacking: lacking ?? null, score, grade }
}

function extractScored(v: unknown): { score: number; grade: string; label: string } | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const score = typeof o.score === 'number' ? o.score : undefined
  const grade = typeof o.grade === 'string' ? o.grade : undefined
  const label = typeof o.label === 'string' ? o.label : undefined
  if (score === undefined || !grade || !label) return undefined
  return { score, grade, label }
}

function extractSpirits(v: unknown): { count: number; notable: string[] } | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const count = typeof o.count === 'number' ? o.count : undefined
  if (count === undefined) return undefined
  const notable = Array.isArray(o.notable)
    ? o.notable.filter((x): x is string => typeof x === 'string')
    : []
  return { count, notable }
}

function extractFortunePhase(v: unknown): SummaryShape['fortunePhase'] | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const current = extractPhase(o.current)
  const next = extractPhase(o.next)
  if (!current && !next) return undefined
  return { current, next }
}

function extractPhase(v: unknown): { age: number; pillar: string; element: string } | undefined {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const age = typeof o.age === 'number' ? o.age : undefined
  const pillar = typeof o.pillar === 'string' ? o.pillar : undefined
  const element = typeof o.element === 'string' ? o.element : undefined
  if (age === undefined || !pillar || !element) return undefined
  return { age, pillar, element }
}

function extractStrength(raw: Record<string, unknown>): SinStrengthShape | null {
  const strength = typeof raw.strength === 'string' ? raw.strength : undefined
  const score = typeof raw.score === 'number' ? raw.score : undefined
  if (!strength || score === undefined) return null
  return {
    isStrong: raw.isStrong === true,
    strength,
    score,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    analysis: typeof raw.analysis === 'string' ? raw.analysis : undefined,
    bigyeopCount: typeof raw.bigyeopCount === 'number' ? raw.bigyeopCount : undefined,
    inseongCount: typeof raw.inseongCount === 'number' ? raw.inseongCount : undefined,
    deukryeong: typeof raw.deukryeong === 'boolean' ? raw.deukryeong : undefined,
    deukji: typeof raw.deukji === 'boolean' ? raw.deukji : undefined,
    deukse: typeof raw.deukse === 'boolean' ? raw.deukse : undefined,
  }
}
