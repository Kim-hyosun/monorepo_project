'use client'

import type { CalculateResult } from '@sazuapp/client'

import { AnalysisSummary } from '@/components/AnalysisSummary'
import { DecadeFortuneTimeline } from '@/components/DecadeFortuneTimeline'
import { FiveElementsChart } from '@/components/FiveElementsChart'
import { FourPillars } from '@/components/FourPillars'
import { InputSummary } from '@/components/InputSummary'
import { JsonExportSection } from '@/components/JsonExportSection'

interface Props {
  data: CalculateResult
  onReset: () => void
}

/** 사주 분석 결과 — input / fourPillars / elements / summary+sinStrength / decadeFortune */
export function SajuResult({ data, onReset }: Props) {
  const m = data.modules
  const summary = m.summary as Record<string, unknown> | undefined
  const currentAge = readCurrentAge(summary)

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-foreground text-xl font-bold'>사주 분석 결과</h2>
        <button
          type='button'
          onClick={onReset}
          className='text-primary text-sm font-medium hover:underline'
        >
          ← 다시 입력
        </button>
      </div>

      <InputSummary
        input={data.input as Record<string, unknown> | undefined}
        timezone={data.timezone as Record<string, unknown> | undefined}
      />
      <FourPillars pillars={m.fourPillars} />
      <FiveElementsChart elements={m.elements} />
      <AnalysisSummary summary={m.summary} sinStrength={m.sinStrength} />
      <DecadeFortuneTimeline decadeFortune={m.decadeFortune} currentAge={currentAge} />
      <JsonExportSection data={data} />
    </div>
  )
}

function readCurrentAge(summary?: Record<string, unknown>): number | undefined {
  if (!summary) return undefined
  const fp = summary.fortunePhase as Record<string, unknown> | undefined
  if (!fp) return undefined
  const cur = fp.current as Record<string, unknown> | undefined
  if (!cur) return undefined
  return typeof cur.age === 'number' ? cur.age : undefined
}
