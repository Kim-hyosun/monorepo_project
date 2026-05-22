'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AioPageHeader } from '@/shared/components/AioPageHeader'
import { AioPanel } from '@/shared/components/AioPanel'
import { KpiCard } from '@/shared/components/KpiCard'
import { cn } from '@/shared/utils/cn'
import { AnalysisResultPanel } from '@/features/ems/components/analysis/AnalysisResultPanel'
import { PumpControlPanel } from '@/features/ems/components/analysis/PumpControlPanel'
import { PumpOperationStatus } from '@/features/ems/components/analysis/PumpOperationStatus'
import { RequiredPressurePanel } from '@/features/ems/components/analysis/RequiredPressurePanel'
import { ReservoirValvePanel } from '@/features/ems/components/analysis/ReservoirValvePanel'
import { EmsPageWrapper } from '@/features/ems/components/EmsPageWrapper'
import { PerformDateRange } from '@/features/ems/components/pumpPerform/PerformDateRange'
import { PumpGaugeCardGrid } from '@/features/ems/components/pumpPerform/PumpGaugeCardGrid'
import { PumpRuntimeBarChart } from '@/features/ems/components/pumpPerform/PumpRuntimeBarChart'
import { AiOperationToggle } from '@/features/ems/components/songsu/AiOperationToggle'
import { AiPumpSection } from '@/features/ems/components/songsu/AiPumpSection'
import { CurrentPumpSection } from '@/features/ems/components/songsu/CurrentPumpSection'
import { PipeFlowDiagram } from '@/features/ems/components/songsu/PipeFlowDiagram'
import { ReservoirOperationGrid } from '@/features/ems/components/songsu/ReservoirOperationGrid'
import { InstantValueTable } from '@/features/ems/components/sujiSelect/InstantValueTable'
import { SujiDateRange } from '@/features/ems/components/sujiSelect/SujiDateRange'
import { TrendChartGrid } from '@/features/ems/components/sujiSelect/TrendChartGrid'
import { LevelDistributionChart } from '@/features/ems/components/sujiSelect2/LevelDistributionChart'
import { LevelInstantList } from '@/features/ems/components/sujiSelect2/LevelInstantList'
import { LevelTrendChart } from '@/features/ems/components/sujiSelect2/LevelTrendChart'
import { ReservoirSelectorList } from '@/features/ems/components/sujiSelect2/ReservoirSelectorList'
import { FacilityHierarchyList } from '@/features/ems/components/usage/FacilityHierarchyList'
import { FacilitySummaryCharts } from '@/features/ems/components/usage/FacilitySummaryCharts'
import { LoadDistributionGrid } from '@/features/ems/components/usage/LoadDistributionGrid'
import { UsageDateRange } from '@/features/ems/components/usage/UsageDateRange'
import { UseTrendOverview } from '@/features/ems/components/usage/UseTrendOverview'
import { ZoneSummaryCharts } from '@/features/ems/components/usage/ZoneSummaryCharts'
import { ZoneUsageGrid } from '@/features/ems/components/usage/ZoneUsageGrid'
import {
  useEmsAnalysisQuery,
  useEmsFacUsageQuery,
  useEmsLatestQuery,
  useEmsPumpPerformQuery,
  useEmsSongsuQuery,
  useEmsSujiSelect2Query,
  useEmsSujiSelectQuery,
  useEmsUseTrendQuery,
  useEmsZoneUsageQuery,
} from '@/features/ems/queries/emsQueries'
import type { PumpPerformGranularity } from '@/features/ems/types/ems'

const EmsLineChart = dynamic(() => import('@/features/ems/components/EmsLineChart'), {
  ssr: false,
  loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
})

const EnergySaveTrendChart = dynamic(
  () => import('@/features/ems/components/analysis/EnergySaveTrendChart'),
  {
    ssr: false,
    loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
  },
)

const PowerMileageAreaChart = dynamic(
  () => import('@/features/ems/components/pumpPerform/PowerMileageAreaChart'),
  {
    ssr: false,
    loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
  },
)

const HzTrendLineChart = dynamic(
  () => import('@/features/ems/components/pumpPerform/HzTrendLineChart'),
  {
    ssr: false,
    loading: () => <div className='text-sm text-[var(--aio-subtitle)]'>차트 로딩 중…</div>,
  },
)

export type PumpAnalysisVariant =
  | 'analysis'
  | 'songsu'
  | 'sujiSelect'
  | 'sujiSelect_2'
  | 'pumpPerform'
  | 'useTrand'
  | 'facUse'
  | 'zoneUse'

const VARIANT_META: Record<PumpAnalysisVariant, { title: string; description: string }> = {
  analysis: { title: '송수펌프 제어 분석', description: '운영현황 · 밸브 · AI 추천 · 절감 트렌드' },
  songsu: { title: '송수', description: '송수 펌프 모니터링' },
  sujiSelect: { title: '수지 선택', description: '수지 운영 선택' },
  sujiSelect_2: { title: '수지 선택 2', description: '수지 운영 선택 (2)' },
  pumpPerform: { title: '펌프 성능', description: '펌프 성능 효율' },
  useTrand: { title: '사용 추이', description: '에너지 사용 추이' },
  facUse: { title: '시설 사용량', description: '시설별 전력 사용량' },
  zoneUse: { title: '구역 사용량', description: '구역별 전력 사용량' },
}

interface Props {
  variant: PumpAnalysisVariant
}

export function PumpAnalysisPage({ variant }: Props) {
  if (variant === 'analysis') return <AnalysisPage />
  if (variant === 'songsu') return <SongsuPage />
  if (variant === 'pumpPerform') return <PumpPerformPage />
  if (variant === 'sujiSelect') return <SujiSelectPage />
  if (variant === 'sujiSelect_2') return <SujiSelect2Page />
  if (variant === 'zoneUse') return <ZoneUsagePage />
  if (variant === 'facUse') return <FacUsagePage />
  if (variant === 'useTrand') return <UseTrendPage />
  return <SimpleVariantPage variant={variant} />
}

function ZoneUsagePage() {
  const [granularity, setGranularity] = useState<PumpPerformGranularity>('hour')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState({ granularity, from, to })
  const { data, isFetching } = useEmsZoneUsageQuery(query.granularity, query.from, query.to)
  const meta = VARIANT_META.zoneUse

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description='시설별 사용량 현황' />
      <UsageDateRange
        granularity={granularity}
        onGranularityChange={setGranularity}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={() => setQuery({ granularity, from, to })}
        disabled={isFetching}
      />
      {!data ? (
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      ) : (
        <>
          <ZoneUsageGrid zones={data.zones} totalKwh={data.totalKwh} />
          <ZoneSummaryCharts data={data} />
        </>
      )}
    </EmsPageWrapper>
  )
}

function FacUsagePage() {
  const [granularity, setGranularity] = useState<PumpPerformGranularity>('hour')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [facility, setFacility] = useState(0)
  const [query, setQuery] = useState({ granularity, from, to })
  const { data, isFetching } = useEmsFacUsageQuery(
    query.granularity,
    facility,
    query.from,
    query.to,
  )
  const meta = VARIANT_META.facUse

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description='설비별 사용량 현황' />
      <UsageDateRange
        granularity={granularity}
        onGranularityChange={setGranularity}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={() => setQuery({ granularity, from, to })}
        disabled={isFetching}
      />
      {!data ? (
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      ) : (
        <>
          <div className='grid grid-cols-12 gap-3'>
            <div className='col-span-6'>
              <FacilityHierarchyList
                categories={data.categories}
                selectedIndex={facility}
                onSelect={setFacility}
              />
            </div>
            <div className='col-span-6'>
              <FacilitySummaryCharts data={data} />
            </div>
          </div>
        </>
      )}
    </EmsPageWrapper>
  )
}

function UseTrendPage() {
  const [granularity, setGranularity] = useState<PumpPerformGranularity>('hour')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState({ granularity, from, to })
  const { data, isFetching } = useEmsUseTrendQuery(query.granularity, query.from, query.to)
  const meta = VARIANT_META.useTrand

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description='사용량 / 비용 트렌드' />
      <UsageDateRange
        granularity={granularity}
        onGranularityChange={setGranularity}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={() => setQuery({ granularity, from, to })}
        disabled={isFetching}
      />
      {!data ? (
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      ) : (
        <>
          <UseTrendOverview data={data} />
          <LoadDistributionGrid processes={data.processes} />
        </>
      )}
    </EmsPageWrapper>
  )
}

function SujiSelectPage() {
  const [granularity, setGranularity] = useState<PumpPerformGranularity>('hour')
  const [dates, setDates] = useState<[string, string, string]>(['', '', ''])
  const [query, setQuery] = useState({ granularity, from: '', to: '' })
  const { data: suji, isFetching } = useEmsSujiSelectQuery(query.granularity, query.from, query.to)
  const meta = VARIANT_META.sujiSelect

  const submit = () => setQuery({ granularity, from: dates[0], to: dates[1] })

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description='송수펌프 제어 트렌드' />

      <SujiDateRange
        granularity={granularity}
        onGranularityChange={setGranularity}
        dates={dates}
        onDateChange={(i, v) =>
          setDates((prev) => {
            const next = [...prev] as [string, string, string]
            next[i] = v
            return next
          })
        }
        onSubmit={submit}
        disabled={isFetching}
      />

      {!suji ? (
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      ) : (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-8'>
            <TrendChartGrid data={suji} />
          </div>
          <div className='col-span-4'>
            <InstantValueTable items={suji.instant} />
          </div>
        </div>
      )}
    </EmsPageWrapper>
  )
}

type Suji2Tab = 'trend' | 'distribution'
const SUJI2_TABS: Array<{ key: Suji2Tab; label: string }> = [
  { key: 'trend', label: '수위 트렌드' },
  { key: 'distribution', label: '분포 / 순시' },
]

function SujiSelect2Page() {
  const [selected, setSelected] = useState<string>('')
  const [tab, setTab] = useState<Suji2Tab>('trend')
  const { data: suji2 } = useEmsSujiSelect2Query(selected)
  const meta = VARIANT_META.sujiSelect_2

  if (!suji2) {
    return (
      <EmsPageWrapper>
        <AioPageHeader title={meta.title} description='주요 배수지 수위 현황' />
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description='주요 배수지 수위 현황' />

      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-12 lg:col-span-3'>
          <ReservoirSelectorList
            reservoirs={suji2.reservoirs}
            selected={suji2.selected}
            onSelect={setSelected}
          />
        </div>

        <div className='col-span-12 lg:col-span-9 space-y-3'>
          <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
            {SUJI2_TABS.map((t) => (
              <button
                key={t.key}
                type='button'
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded px-3 py-1.5 text-xs font-medium transition',
                  tab === t.key
                    ? 'bg-[var(--aio-accent)]/30 text-white'
                    : 'text-[var(--aio-subtitle)] hover:bg-white/5',
                )}
                style={tab === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'trend' ? <LevelTrendChart data={suji2} /> : null}
          {tab === 'distribution' ? (
            <>
              <LevelDistributionChart items={suji2.distribution} selected={suji2.selected} />
              <LevelInstantList items={suji2.instant} />
            </>
          ) : null}
        </div>
      </div>
    </EmsPageWrapper>
  )
}

type PumpPerformTab = 'chart' | 'runtime'
const PUMP_PERFORM_TABS: Array<{ key: PumpPerformTab; label: string }> = [
  { key: 'chart', label: '게이지 + 차트' },
  { key: 'runtime', label: '가동시간' },
]

function PumpPerformPage() {
  const [granularity, setGranularity] = useState<PumpPerformGranularity>('hour')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState({ granularity, from, to })
  const [tab, setTab] = useState<PumpPerformTab>('chart')
  const { data: perform, isFetching } = useEmsPumpPerformQuery(
    query.granularity,
    query.from,
    query.to,
  )
  const meta = VARIANT_META.pumpPerform

  const submit = () => setQuery({ granularity, from, to })

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <PerformDateRange
        granularity={granularity}
        onGranularityChange={setGranularity}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={submit}
        disabled={isFetching}
      />

      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {PUMP_PERFORM_TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition',
              tab === t.key
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
            style={tab === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!perform ? (
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      ) : tab === 'chart' ? (
        <>
          <PumpGaugeCardGrid gauges={perform.gauges} />
          <AioPanel className='p-4'>
            <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>
              전력 사용량 (kWh)
            </h3>
            <PowerMileageAreaChart data={perform} height={280} />
            <div className='mt-4'>
              <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>
                송산 주파수 (Hz)
              </h3>
              <HzTrendLineChart data={perform} height={220} />
            </div>
          </AioPanel>
        </>
      ) : (
        <PumpRuntimeBarChart rows={perform.runtimeBars} />
      )}
    </EmsPageWrapper>
  )
}

type SongsuTab = 'operation' | 'reservoir'
const SONGSU_TABS: Array<{ key: SongsuTab; label: string }> = [
  { key: 'operation', label: 'AI 운영' },
  { key: 'reservoir', label: '배수지' },
]

function SongsuPage() {
  const { data: songsu } = useEmsSongsuQuery()
  const meta = VARIANT_META.songsu
  const [tab, setTab] = useState<SongsuTab>('operation')

  if (!songsu) {
    return (
      <EmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {SONGSU_TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition',
              tab === t.key
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
            style={tab === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'operation' ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 lg:col-span-7 space-y-3'>
            <AiPumpSection pyeongtaek={songsu.pyeongtaek.ai} songsan={songsu.songsan.ai} />
            <CurrentPumpSection
              pyeongtaek={songsu.pyeongtaek.current}
              songsan={songsu.songsan.current}
            />
            <PipeFlowDiagram pipe={songsu.pipe} />
          </div>
          <div className='col-span-12 lg:col-span-5'>
            <AiOperationToggle
              pyeongtaek={songsu.aiOperation.pyeongtaek}
              songsan={songsu.aiOperation.songsan}
            />
          </div>
        </div>
      ) : null}

      {tab === 'reservoir' ? <ReservoirOperationGrid reservoirs={songsu.reservoirs} /> : null}
    </EmsPageWrapper>
  )
}

type AnalysisTab = 'status' | 'control' | 'result'
const ANALYSIS_TABS: Array<{ key: AnalysisTab; label: string }> = [
  { key: 'status', label: '운영현황' },
  { key: 'control', label: '펌프제어' },
  { key: 'result', label: '분석결과' },
]

function AnalysisPage() {
  const { data: analysis } = useEmsAnalysisQuery()
  const meta = VARIANT_META.analysis
  const [tab, setTab] = useState<AnalysisTab>('status')

  if (!analysis) {
    return (
      <EmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <div className='flex flex-wrap gap-1 rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-1'>
        {ANALYSIS_TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition',
              tab === t.key
                ? 'bg-[var(--aio-accent)]/30 text-white'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
            style={tab === t.key ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'status' ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 md:col-span-6 space-y-3'>
            <PumpOperationStatus pyeongtaek={analysis.pyeongtaek} songsan={analysis.songsan} />
          </div>
          <div className='col-span-12 md:col-span-6 space-y-3'>
            <ReservoirValvePanel reservoirs={analysis.reservoirs} />
          </div>
        </div>
      ) : null}

      {tab === 'control' ? (
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 md:col-span-6 space-y-3'>
            <RequiredPressurePanel required={analysis.required} />
          </div>
          <div className='col-span-12 md:col-span-6 space-y-3'>
            <PumpControlPanel pyeongtaek={analysis.pyeongtaek} songsan={analysis.songsan} />
          </div>
        </div>
      ) : null}

      {tab === 'result' ? (
        <div className='space-y-3'>
          <AnalysisResultPanel
            pyeongtaekAi={analysis.pyeongtaekAi}
            songsanAi={analysis.songsanAi}
          />
          <AioPanel className='p-4'>
            <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>
              에너지 절감 트렌드
            </h3>
            <EnergySaveTrendChart trend={analysis.energyTrend} height={260} />
          </AioPanel>
        </div>
      ) : null}
    </EmsPageWrapper>
  )
}

function SimpleVariantPage({ variant }: { variant: PumpAnalysisVariant }) {
  const { data: latest } = useEmsLatestQuery()
  const meta = VARIANT_META[variant]

  if (!latest) {
    return (
      <EmsPageWrapper>
        <div className='text-[var(--aio-subtitle)]'>로딩 중…</div>
      </EmsPageWrapper>
    )
  }

  const { pump, power_trend, ai_power_trend, load_trend } = latest

  const h1Total = (pump.h1_pm1 ?? 0) + (pump.h1_pm2 ?? 0) + (pump.h1_pm3 ?? 0) + (pump.h1_pm4 ?? 0)
  const h2Total =
    (pump.h2_pm1 ?? 0) + (pump.h2_pm2 ?? 0) + (pump.h2_pm_sp1 ?? 0) + (pump.h2_pm_sp2 ?? 0)
  const aiH1Total =
    (pump.ai_h1_pm1 ?? 0) + (pump.ai_h1_pm2 ?? 0) + (pump.ai_h1_pm3 ?? 0) + (pump.ai_h1_pm4 ?? 0)
  const aiH2Total =
    (pump.ai_h2_pm1 ?? 0) +
    (pump.ai_h2_pm2 ?? 0) +
    (pump.ai_h2_pm_sp1 ?? 0) +
    (pump.ai_h2_pm_sp2 ?? 0)

  return (
    <EmsPageWrapper>
      <AioPageHeader title={meta.title} description={meta.description} />

      <div className='grid grid-cols-4 gap-3'>
        <KpiCard variant='dark' label='평택 H1 합계' value={h1Total.toFixed(1)} unit='kW' />
        <KpiCard variant='dark' label='안성 H2 합계' value={h2Total.toFixed(1)} unit='kW' />
        <KpiCard
          variant='dark'
          label='AI H1 추천'
          value={aiH1Total.toFixed(1)}
          unit='kW'
          highlight
        />
        <KpiCard
          variant='dark'
          label='AI H2 추천'
          value={aiH2Total.toFixed(1)}
          unit='kW'
          highlight
        />
      </div>

      <AioPanel className='p-4'>
        <EmsLineChart
          title='전력 (실제 vs AI 추천)'
          series={[
            { name: '실제 Power', data: power_trend },
            { name: 'AI Power', data: ai_power_trend, color: '#34d399' },
          ]}
          yLabel='kW'
          height={280}
        />
      </AioPanel>

      <AioPanel className='p-4'>
        <EmsLineChart
          title='부하 추이'
          series={[{ name: '부하', data: load_trend, color: '#fbbf24' }]}
          yLabel='kW'
          height={220}
        />
      </AioPanel>

      <AioPanel className='p-4'>
        <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>펌프 채널 상세</h3>
        <div className='grid grid-cols-4 gap-2 md:grid-cols-8'>
          <KpiCard variant='dark' label='H1 PM1' value={pump.h1_pm1} unit='kW' />
          <KpiCard variant='dark' label='H1 PM2' value={pump.h1_pm2} unit='kW' />
          <KpiCard variant='dark' label='H1 PM3' value={pump.h1_pm3} unit='kW' />
          <KpiCard variant='dark' label='H1 PM4' value={pump.h1_pm4} unit='kW' />
          <KpiCard variant='dark' label='H2 PM1' value={pump.h2_pm1} unit='kW' />
          <KpiCard variant='dark' label='H2 PM2' value={pump.h2_pm2} unit='kW' />
          <KpiCard variant='dark' label='H2 SP1' value={pump.h2_pm_sp1} unit='kW' />
          <KpiCard variant='dark' label='H2 SP2' value={pump.h2_pm_sp2} unit='kW' />
        </div>
      </AioPanel>
    </EmsPageWrapper>
  )
}
