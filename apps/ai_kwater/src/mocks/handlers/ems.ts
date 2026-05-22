import { http, HttpResponse } from 'msw'

import type { CostSetting, GoalConfig, PeakSetting } from '@/features/ems/types/ems'
import type { PumpPerformGranularity } from '@/features/ems/types/ems'
import {
  buildFacUsage,
  buildReport,
  buildSujiSelect,
  buildSujiSelect2,
  buildUseTrend,
  buildZoneUsage,
  costSetting,
  getPumpPerform,
  goalConfig,
  peakSetting,
  seedAnalysis,
  seedCosts,
  seedDrParticipation,
  seedEmsLatest,
  seedEnergyFactor,
  seedReservoirs,
  seedSongsu,
  seedTagsMutable,
  seedZones,
  setCostSetting,
  setGoalConfig,
  setPeakSetting,
  setSongsuAiOperation,
} from '@/mocks/data/ems'

export const emsHandlers = [
  http.get('*/ems/latest', () => HttpResponse.json({ latest: seedEmsLatest })),

  http.put('*/ems/operation/:channel', async ({ params, request }) => {
    const body = (await request.json()) as { mode: 0 | 1 | 2 }
    if (params.channel === 'h1') seedEmsLatest.pump.h1_operation_mode = body.mode
    if (params.channel === 'h2') seedEmsLatest.pump.h2_operation_mode = body.mode
    return HttpResponse.json({ latest: seedEmsLatest })
  }),

  http.get('*/ems/costs', () => HttpResponse.json({ items: seedCosts })),

  http.get('*/ems/cost-setting', () => HttpResponse.json({ setting: costSetting })),
  http.put('*/ems/cost-setting', async ({ request }) => {
    const body = (await request.json()) as CostSetting
    setCostSetting(body)
    return HttpResponse.json({ setting: body })
  }),

  http.get('*/ems/goal', () => HttpResponse.json({ goal: goalConfig })),
  http.put('*/ems/goal', async ({ request }) => {
    const body = (await request.json()) as GoalConfig
    setGoalConfig(body)
    return HttpResponse.json({ goal: body })
  }),

  http.get('*/ems/peak-setting', () => HttpResponse.json({ peak: peakSetting })),
  http.put('*/ems/peak-setting', async ({ request }) => {
    const body = (await request.json()) as PeakSetting
    setPeakSetting(body)
    return HttpResponse.json({ peak: body })
  }),

  http.get('*/ems/tags', () => HttpResponse.json({ tags: seedTagsMutable })),
  http.put('*/ems/tags/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<(typeof seedTagsMutable)[number]>
    const idx = seedTagsMutable.findIndex((t) => t.id === params.id)
    if (idx < 0) return new HttpResponse(null, { status: 404 })
    seedTagsMutable[idx] = { ...seedTagsMutable[idx], ...body }
    return HttpResponse.json({ tags: seedTagsMutable })
  }),

  http.get('*/ems/report', ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from') ?? ''
    const to = url.searchParams.get('to') ?? ''
    return HttpResponse.json({ rows: buildReport(from, to) })
  }),

  http.get('*/ems/factors', () => HttpResponse.json({ factor: seedEnergyFactor })),

  http.get('*/ems/zones', () => HttpResponse.json({ zones: seedZones })),

  http.get('*/ems/reservoirs', () => HttpResponse.json({ reservoirs: seedReservoirs })),

  http.get('*/ems/dr-participation', () =>
    HttpResponse.json({ dr: seedDrParticipation }),
  ),

  http.get('*/ems/analysis', () => HttpResponse.json({ analysis: seedAnalysis })),

  http.get('*/ems/songsu', () => HttpResponse.json({ songsu: seedSongsu })),

  http.put('*/ems/songsu/ai/:station', async ({ params, request }) => {
    const body = (await request.json()) as { enabled: boolean; mode: 'auto' | 'semi' }
    if (params.station === 'pyeongtaek' || params.station === 'songsan') {
      setSongsuAiOperation(params.station, body)
    }
    return HttpResponse.json({ songsu: seedSongsu })
  }),

  http.get('*/ems/pump-perform', ({ request }) => {
    const url = new URL(request.url)
    const g = (url.searchParams.get('granularity') ?? 'hour') as PumpPerformGranularity
    return HttpResponse.json({ perform: getPumpPerform(g) })
  }),

  http.get('*/ems/suji-select', ({ request }) => {
    const url = new URL(request.url)
    const g = (url.searchParams.get('granularity') ?? 'hour') as PumpPerformGranularity
    return HttpResponse.json({ suji: buildSujiSelect(g) })
  }),

  http.get('*/ems/suji-select2', ({ request }) => {
    const url = new URL(request.url)
    const r = url.searchParams.get('reservoir') ?? undefined
    return HttpResponse.json({ suji2: buildSujiSelect2(r ?? undefined) })
  }),

  http.get('*/ems/zone-usage', ({ request }) => {
    const url = new URL(request.url)
    const g = (url.searchParams.get('granularity') ?? 'hour') as PumpPerformGranularity
    return HttpResponse.json({ zoneUsage: buildZoneUsage(g) })
  }),

  http.get('*/ems/fac-usage', ({ request }) => {
    const url = new URL(request.url)
    const g = (url.searchParams.get('granularity') ?? 'hour') as PumpPerformGranularity
    const facility = Number(url.searchParams.get('facility') ?? 0)
    return HttpResponse.json({ facUsage: buildFacUsage(g, facility) })
  }),

  http.get('*/ems/use-trend', ({ request }) => {
    const url = new URL(request.url)
    const g = (url.searchParams.get('granularity') ?? 'hour') as PumpPerformGranularity
    return HttpResponse.json({ useTrend: buildUseTrend(g) })
  }),
]
