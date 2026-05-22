import type {
  AnalysisData,
  CostItem,
  CostSetting,
  DrParticipation,
  EmsLatest,
  EmsTag,
  EnergyFactor,
  FacUsageData,
  GoalConfig,
  PeakSetting,
  PumpPerformData,
  PumpPerformGranularity,
  PumpRuntimeRow,
  ReportRow,
  Reservoir,
  SongsuData,
  SongsuReservoir,
  SujiSelect2Data,
  SujiSelectData,
  UseTrendData,
  Zone,
  ZoneUsageData,
} from '@/features/ems/types/ems'

function nowMs() {
  return Date.now()
}

function trend(base: number, jitter: number, points = 60, stepMs = 60_000): Array<[number, number]> {
  const end = nowMs()
  return Array.from({ length: points }, (_, i) => {
    const t = end - (points - 1 - i) * stepMs
    const v = base + (Math.random() - 0.5) * jitter
    return [t, Number(v.toFixed(2))] as [number, number]
  })
}

export const seedEmsLatest: EmsLatest = {
  pump: {
    h1_operation_mode: 2,
    h2_operation_mode: 1,
    h1_pm1: 320,
    h1_pm2: 312,
    h1_pm3: 308,
    h1_pm4: 0,
    h2_pm1: 270,
    h2_pm2: 268,
    h2_pm_sp1: 145,
    h2_pm_sp2: 0,
    ai_h1_pm1: 318,
    ai_h1_pm2: 310,
    ai_h1_pm3: 305,
    ai_h1_pm4: 0,
    ai_h2_pm1: 265,
    ai_h2_pm2: 262,
    ai_h2_pm_sp1: 140,
    ai_h2_pm_sp2: 0,
  },
  peak: {
    z_power1: 1820,
    ai_z_power1: 1740,
    ai_z_power_peak1: 1980,
  },
  dr: {
    z_cbl: 1900,
    ai_z_dr_power: 80,
  },
  power_trend: trend(1820, 240),
  ai_power_trend: trend(1740, 200),
  load_trend: trend(1850, 280),
}

export let costSetting: CostSetting = {
  baseRate: 7390,
  unitRate: 105.3,
  peakRate: 200.5,
  drDiscount: 8,
}

export const setCostSetting = (s: CostSetting) => {
  costSetting = s
}

export let goalConfig: GoalConfig = {
  targetReductionPct: 8,
  targetPeakKw: 1700,
  targetCostKrw: 1_200_000_000,
  fiscalYear: new Date().getFullYear(),
}

export const setGoalConfig = (g: GoalConfig) => {
  goalConfig = g
}

export let peakSetting: PeakSetting = {
  peakStartHour: 13,
  peakEndHour: 17,
  peakLimitKw: 1800,
  drDispatchKw: 120,
  enabled: true,
}

export const setPeakSetting = (p: PeakSetting) => {
  peakSetting = p
}

export const seedCosts: CostItem[] = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, '0')
  const usage = 1_200_000 + Math.round(Math.random() * 400_000)
  const peak = 1_600 + Math.round(Math.random() * 400)
  const reduction = Math.round(usage * (0.05 + Math.random() * 0.05))
  const fee = Math.round(usage * 105 + peak * 200)
  return {
    month: `${new Date().getFullYear()}-${month}`,
    usage,
    peak,
    reduction,
    fee,
  }
})

export const seedTags: EmsTag[] = [
  { id: 't1', tag: 'H1.PM1.kW', label: '평택 H1 PM1 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't2', tag: 'H1.PM2.kW', label: '평택 H1 PM2 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't3', tag: 'H1.PM3.kW', label: '평택 H1 PM3 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't4', tag: 'H1.PM4.kW', label: '평택 H1 PM4 전력', unit: 'kW', category: 'pump', enabled: false },
  { id: 't5', tag: 'H2.PM1.kW', label: '안성 H2 PM1 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't6', tag: 'H2.PM2.kW', label: '안성 H2 PM2 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't7', tag: 'H2.SP1.kW', label: '안성 H2 SP1 전력', unit: 'kW', category: 'pump', enabled: true },
  { id: 't8', tag: 'H2.SP2.kW', label: '안성 H2 SP2 전력', unit: 'kW', category: 'pump', enabled: false },
  { id: 't9', tag: 'Z.POWER1', label: '구역 1 피크', unit: 'kW', category: 'peak', enabled: true },
  { id: 't10', tag: 'Z.CBL', label: 'CBL 부하', unit: 'kW', category: 'dr', enabled: true },
  { id: 't11', tag: 'Z.DR.POWER', label: 'AI DR 전력', unit: 'kW', category: 'dr', enabled: true },
  { id: 't12', tag: 'COST.UNIT', label: '사용량 단가', unit: '원/kWh', category: 'cost', enabled: true },
  { id: 't13', tag: 'COST.PEAK', label: '피크 단가', unit: '원/kW', category: 'cost', enabled: true },
  { id: 't14', tag: 'MISC.AMB.TEMP', label: '외기 온도', unit: '℃', category: 'misc', enabled: true },
]

export const setTags = (updater: (tags: EmsTag[]) => EmsTag[]) => {
  seedTagsMutable.splice(0, seedTagsMutable.length, ...updater(seedTagsMutable))
}

export const seedTagsMutable: EmsTag[] = [...seedTags]

export const seedEnergyFactor: EnergyFactor = {
  todayUsage: 26_540,
  monthUsage: 712_300,
  yearUsage: 8_245_900,
  todaySave: 1_762,
  monthSave: 7_549,
  yearSave: 10_582,
  todayCo2: 23.5,
  monthCo2: 122.68,
  yearCo2: 180.22,
  dayPct: 92,
  monthPct: 88,
  yearPct: 95,
  nowKw: 1_820,
}

export const seedZones: Zone[] = [
  {
    code: '탈수기동',
    usagePct: 14,
    totalKwh: 3_720,
    top3: [
      { name: '탈수기 #1', usageKwh: 1_320 },
      { name: '탈수기 #2', usageKwh: 1_180 },
      { name: '컨베이어 #1', usageKwh: 1_220 },
    ],
  },
  {
    code: '오존설비동',
    usagePct: 22,
    totalKwh: 5_840,
    top3: [
      { name: '오존발생기 #1', usageKwh: 2_410 },
      { name: '오존발생기 #2', usageKwh: 2_080 },
      { name: '오존주입펌프', usageKwh: 1_350 },
    ],
  },
  {
    code: '관리동',
    usagePct: 8,
    totalKwh: 2_120,
    top3: [
      { name: 'HVAC 1F', usageKwh: 980 },
      { name: 'HVAC 2F', usageKwh: 720 },
      { name: '조명', usageKwh: 420 },
    ],
  },
  {
    code: '송수펌프동',
    usagePct: 38,
    totalKwh: 10_080,
    top3: [
      { name: '송수펌프 H1.PM1', usageKwh: 3_810 },
      { name: '송수펌프 H1.PM2', usageKwh: 3_620 },
      { name: '송수펌프 H2.PM1', usageKwh: 2_650 },
    ],
  },
  {
    code: '염소투입동',
    usagePct: 12,
    totalKwh: 3_180,
    top3: [
      { name: '염소투입펌프 #1', usageKwh: 1_220 },
      { name: '염소투입펌프 #2', usageKwh: 1_080 },
      { name: '환기설비', usageKwh: 880 },
    ],
  },
  {
    code: '원수동',
    usagePct: 6,
    totalKwh: 1_600,
    top3: [
      { name: '원수펌프 #1', usageKwh: 720 },
      { name: '원수펌프 #2', usageKwh: 540 },
      { name: '약품주입', usageKwh: 340 },
    ],
  },
]

function dailyTrend(base: number, jitter: number, points = 24): Array<[number, number]> {
  const end = Date.now()
  const stepMs = 3_600_000
  return Array.from({ length: points }, (_, i) => {
    const t = end - (points - 1 - i) * stepMs
    const v = base + (Math.random() - 0.5) * jitter
    return [t, Number(v.toFixed(1))] as [number, number]
  })
}

export const seedReservoirs: Reservoir[] = [
  {
    name: '봉담2',
    levelPct: 78,
    usageTrend: dailyTrend(420, 80),
    flowRate: 410,
  },
  {
    name: '남양6',
    levelPct: 64,
    usageTrend: dailyTrend(380, 70),
    flowRate: 360,
  },
  {
    name: '마도',
    levelPct: 52,
    usageTrend: dailyTrend(220, 50),
    flowRate: 210,
  },
]

export const seedDrParticipation: DrParticipation = {
  drTrend: trend(80, 30),
  peakTrend: trend(1_820, 250),
  cblTrend: trend(1_900, 120),
  aiTrend: trend(1_740, 200),
}

function trendSeries(start: number, end: number, points: number, base: number, amp: number): Array<number | null> {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1)
    const wave = Math.sin(t * Math.PI * 2) * amp
    const noise = (Math.random() - 0.5) * amp * 0.3
    if (i < points * 0.1 && Math.random() < 0.5) return null
    return Number((base + wave + noise + start * 0 + end * 0).toFixed(0))
  })
}

const trendStart = Date.UTC(2024, 6, 1)
const weekMs = 7 * 24 * 3600 * 1000

export const seedAnalysis: AnalysisData = {
  pyeongtaek: {
    pressure: 6.8,
    flow: 1_240.5,
    activePumps: [true, true, false, false],
    freq: [],
  },
  pyeongtaekAi: {
    pressure: 6.6,
    flow: 1_220.0,
    pumps: [true, true, true, false],
    freq: [],
  },
  songsan: {
    pressure: 5.4,
    flow: 820.3,
    activePumps: [true, false],
    freq: [42.5, 0],
  },
  songsanAi: {
    pressure: 5.3,
    flow: 815.0,
    pumps: [true, true],
    freq: [38.0, 38.0],
  },
  reservoirs: [
    {
      name: '봉담',
      minRequiredPressure: 7.2,
      inflow: 48.8,
      valves: [
        { id: '745-617-LEI-8982', state: 'on', opening: 40.01, flowing: true },
        { id: '745-617-LEI-8983', state: 'on', opening: 40.01, flowing: true },
      ],
      waterLevels: [3.4, 3.1],
      outflow: 32.5,
    },
    {
      name: '남양6',
      minRequiredPressure: 7.0,
      inflow: 45.46,
      valves: [
        { id: '745-617-LEI-8856', state: 'on', opening: 38.5, flowing: true },
        { id: '745-617-LEI-8857', state: 'off', opening: 0, flowing: false },
      ],
      waterLevels: [4.2, 3.8],
      outflow: 28.4,
    },
    {
      name: '남양6_2',
      minRequiredPressure: 6.9,
      inflow: 22.1,
      valves: [
        { id: '745-617-LEI-8965', state: 'on', opening: 25.0, flowing: true },
        { id: '745-617-LEI-8966', state: 'off', opening: 0, flowing: false },
      ],
      waterLevels: [2.8, 2.4],
      outflow: 18.5,
    },
    {
      name: '마도',
      minRequiredPressure: 6.8,
      inflow: 18.3,
      valves: [
        { id: '745-617-LEI-8984', state: 'on', opening: 30.0, flowing: true },
        { id: '745-617-LEI-8987', state: 'off', opening: 0, flowing: false },
      ],
      waterLevels: [3.1, 2.7],
      outflow: 14.2,
    },
  ],
  required: {
    baseReservoir: '봉담',
    branchPoint: 7.5,
    minPressure: 7.2,
  },
  energyTrend: {
    startMs: trendStart,
    intervalMs: weekMs,
    baseline: trendSeries(0, 0, 75, 20_000, 8_000),
    current: trendSeries(0, 0, 75, 18_500, 7_000),
    saving: trendSeries(0, 0, 75, 44_000, 6_000),
  },
}

function singleLineReservoir(
  name: SongsuReservoir['name'],
  inflow: number,
  outflow: number,
  headerValue: number | null = null,
  level: [number, number] = [3.0, 2.6],
): SongsuReservoir {
  return {
    name,
    headerValue,
    lines: [
      {
        inflow,
        valvesIn: [
          { state: 'on', opening: 40 + Math.random() * 20 },
          { state: 'on', opening: 30 + Math.random() * 20 },
        ],
        waterLevels: level,
        valvesOut: [
          { state: 'on', opening: 35 + Math.random() * 20 },
          { state: 'off', opening: 0 },
        ],
        outflow,
      },
    ],
  }
}

function multiLineReservoir(
  name: SongsuReservoir['name'],
  lines: number,
  baseInflow: number,
  baseOutflow: number,
  headerValue: number | null = null,
): SongsuReservoir {
  return {
    name,
    headerValue,
    lines: Array.from({ length: lines }, () => ({
      inflow: baseInflow + (Math.random() - 0.5) * 5,
      valvesIn: [
        { state: 'on', opening: 35 + Math.random() * 20 },
        Math.random() > 0.5
          ? { state: 'on', opening: 30 + Math.random() * 20 }
          : { state: 'off', opening: 0 },
      ],
      waterLevels: [3.0 + Math.random() * 0.8, 2.5 + Math.random() * 0.7],
      valvesOut: [
        { state: 'on', opening: 28 + Math.random() * 22 },
        { state: 'off', opening: 0 },
      ],
      outflow: baseOutflow + (Math.random() - 0.5) * 4,
    })),
  }
}

export const seedSongsu: SongsuData = {
  pyeongtaek: {
    current: { power: 770, pressure: 7.7, flow: 3_304, pumps: [true, true, false, false], freq: [] },
    ai: { power: 720, pressure: 7.6, flow: 3_280, pumps: [true, true, true, false], freq: [] },
  },
  songsan: {
    current: { power: 540, pressure: 5.4, flow: 1_820, pumps: [true, false], freq: [42.5, 0] },
    ai: { power: 510, pressure: 5.3, flow: 1_800, pumps: [true, true], freq: [38.0, 38.0] },
  },
  aiOperation: {
    pyeongtaek: { enabled: true, mode: 'auto' },
    songsan: { enabled: false, mode: 'semi' },
  },
  pipe: { pyeongtaekFlow: 0.8, songsanFlow: 0.5 },
  reservoirs: [
    singleLineReservoir('봉담2', 48.8, 32.5, 7.2),
    multiLineReservoir('남양6', 2, 45.0, 28.0, 7.0),
    singleLineReservoir('마도', 18.3, 14.2, 6.8),
    multiLineReservoir('배양', 2, 35.0, 22.0, 6.9),
    singleLineReservoir('광평', 22.4, 18.6, 6.7),
    singleLineReservoir('비봉', 16.8, 13.2, 6.6),
    singleLineReservoir('동화', 14.5, 11.0, 6.5),
    multiLineReservoir('남양5', 3, 30.0, 18.0, 6.8),
    singleLineReservoir('문호', 12.4, 9.8, 6.4),
    singleLineReservoir('상리', 10.2, 8.0, 6.3),
  ],
}

export function setSongsuAiOperation(
  station: 'pyeongtaek' | 'songsan',
  config: { enabled: boolean; mode: 'auto' | 'semi' },
) {
  seedSongsu.aiOperation[station] = config
}

const PUMP_NAMES = [
  '평택계통1',
  '평택계통2',
  '평택계통3',
  '평택계통4',
  '평택계통5',
  '평택계통6',
]
const POWER_COLORS = ['#6D5495', '#A866AD', '#846EFF', '#C2AFFF', '#EF5656', '#DB4848']
const POWER_SERIES_NAMES = [
  '평택계통1',
  '평택계통2',
  '평택계통3',
  '평택계통4',
  '송산계통1',
  '송산계통2',
]
const HZ_SERIES_NAMES = ['송산계통1', '송산계통2']

function arr(points: number, base: number, jitter: number, lo = 0): number[] {
  return Array.from({ length: points }, () =>
    Math.max(lo, Math.round(base + (Math.random() - 0.5) * jitter)),
  )
}

function runtimeRow(name: string): PumpRuntimeRow {
  const segments = []
  let remaining = 100
  while (remaining > 0) {
    const w = Math.min(remaining, Math.max(2, Math.round(Math.random() * 18)))
    segments.push({ duration: w, on: Math.random() > 0.4 })
    remaining -= w
  }
  return { name, segments }
}

function buildPumpPerform(granularity: PumpPerformGranularity): PumpPerformData {
  const intervalMs =
    granularity === 'hour'
      ? 3_600_000
      : granularity === 'day'
        ? 86_400_000
        : granularity === 'month'
          ? 30 * 86_400_000
          : 365 * 86_400_000
  const startMs = Date.now() - 12 * intervalMs

  return {
    startMs,
    intervalMs,
    gauges: PUMP_NAMES.map((name, i) => ({
      name,
      pumpingGaugeValue: Number((10 + Math.random() * 80).toFixed(1)),
      pumpingHead: 30 + Math.floor(Math.random() * 70),
      pumpingStream: 2_400 + Math.floor(i * 25),
    })),
    powerMileage: POWER_SERIES_NAMES.map((name, i) => ({
      name,
      color: POWER_COLORS[i],
      data: arr(12, i < 4 ? 300 : 250, 350, 30),
    })),
    hzTrend: HZ_SERIES_NAMES.map((name, i) => ({
      name,
      color: POWER_COLORS[i + 4],
      data: arr(12, 40, 20, 0),
    })),
    runtimeBars: PUMP_NAMES.map(runtimeRow),
  }
}

export function getPumpPerform(granularity: PumpPerformGranularity): PumpPerformData {
  return buildPumpPerform(granularity)
}

export function buildSujiSelect(granularity: PumpPerformGranularity): SujiSelectData {
  const intervalMs =
    granularity === 'hour'
      ? 3_600_000
      : granularity === 'day'
        ? 86_400_000
        : granularity === 'month'
          ? 30 * 86_400_000
          : 365 * 86_400_000
  const startMs = Date.now() - 11 * intervalMs

  const gen = (base: number, jitter: number, points = 12) =>
    Array.from({ length: points }, () =>
      Number((base + (Math.random() - 0.5) * jitter).toFixed(1)),
    )

  return {
    granularity,
    startMs,
    intervalMs,
    trends: [
      { key: 'level', label: '배수지 수위', unit: 'm', values: gen(55, 4) },
      { key: 'inflow', label: '배수지 유입 유량', unit: 'm³/h', values: gen(60_000, 40_000) },
      { key: 'valve', label: '배수지 유입 밸브 상태', unit: '%', values: gen(70, 60) },
      { key: 'outflow', label: '송수펌프 유출 유량', unit: 'm³/h', values: gen(40, 30) },
      { key: 'pressure', label: '정속 펌프 토출 관압', unit: 'kg/cm²', values: gen(7, 1.5) },
      { key: 'pumpCount', label: '정속 펌프 가동 대수', unit: '대', values: gen(3, 2, 12).map((v) => Math.max(0, Math.round(v))) },
    ],
    instant: [
      { name: '배수지 수위', value: 56, unit: 'm' },
      { name: '배수지 유입 유량', value: 65_240, unit: 'm³/h' },
      { name: '배수지 유입 밸브 상태', value: 80, unit: '%' },
      { name: '송수 펌프 유출 유량', value: 42, unit: 'm³/h' },
      { name: '정속 펌프 토출 관압', value: 7.2, unit: 'kg/cm²' },
      { name: '정속 펌프 가동 대수', value: 3, unit: '대' },
    ],
  }
}

const SUJI2_RESERVOIRS = [
  '광평',
  '남양5',
  '남양6',
  '남양6_한계수위 도달',
  '남양6신설',
  '능5',
  '동화',
  '마도',
  '문호',
  '배양5',
  '배양6',
  '봉담2',
  '비봉',
  '상리',
]

export function buildSujiSelect2(reservoir?: string): SujiSelect2Data {
  const selected = reservoir && SUJI2_RESERVOIRS.includes(reservoir) ? reservoir : SUJI2_RESERVOIRS[0]
  const intervalMs = 3_600_000
  const startMs = Date.now() - 23 * intervalMs
  const levels = Array.from({ length: 24 }, () =>
    Number((3.0 + Math.random() * 1.5).toFixed(2)),
  )

  return {
    reservoirs: SUJI2_RESERVOIRS,
    selected,
    selectedTrend: { startMs, intervalMs, levels },
    distribution: SUJI2_RESERVOIRS.map((name) => {
      const levelM = Number((1.5 + Math.random() * 3.5).toFixed(2))
      return {
        name,
        levelM,
        capacityPct: Math.round((levelM / 5) * 100),
      }
    }),
    instant: [
      { name: '봉담2', levelM: 4.62, unit: 'm' },
      { name: '남양6', levelM: 3.85, unit: 'm' },
      { name: '마도', levelM: 2.74, unit: 'm' },
      { name: '광평', levelM: 3.12, unit: 'm' },
      { name: '비봉', levelM: 2.95, unit: 'm' },
      { name: '동화', levelM: 3.40, unit: 'm' },
      { name: '문호', levelM: 2.18, unit: 'm' },
    ],
  }
}

const ZONE_NAMES = [
  '관리동',
  '활성탄흡착지동',
  '약품투입동',
  '오존설비동',
  '금속여과지동',
  '송수펌프동',
  '염소투입동',
  '탈수기동내부',
]

const USAGE_PALETTE = [
  '#5cafff',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#7dd3fc',
  '#fb923c',
  '#22d3ee',
]

function granIntervalMs(granularity: PumpPerformGranularity): number {
  return granularity === 'hour'
    ? 3_600_000
    : granularity === 'day'
      ? 86_400_000
      : granularity === 'month'
        ? 30 * 86_400_000
        : 365 * 86_400_000
}

export function buildZoneUsage(granularity: PumpPerformGranularity): ZoneUsageData {
  const intervalMs = granIntervalMs(granularity)
  const startMs = Date.now() - 11 * intervalMs
  const zones = ZONE_NAMES.map((name) => {
    const total = 60_000 + Math.round(Math.random() * 400_000)
    return {
      name,
      instantKw: 80 + Math.round(Math.random() * 320),
      totalKwh: total,
      hourlyPeakKw: 120 + Math.round(Math.random() * 320),
      peakHourDate: `2026-05-${String(10 + Math.floor(Math.random() * 11)).padStart(2, '0')} ${String(8 + Math.floor(Math.random() * 12)).padStart(2, '0')}:00`,
    }
  })
  return {
    startMs,
    intervalMs,
    totalKwh: zones.reduce((s, z) => s + z.totalKwh, 0),
    zones,
    sumChart: zones.map((z) => ({ name: z.name, value: z.totalKwh })),
    distributionChart: zones.map((z) => ({ name: z.name, value: z.hourlyPeakKw })),
    trendChart: zones.map((z, i) => ({
      name: z.name,
      color: USAGE_PALETTE[i % USAGE_PALETTE.length],
      data: Array.from({ length: 12 }, () => 50 + Math.round(Math.random() * 250)),
    })),
  }
}

const FAC_CATEGORIES = [
  { name: '관리동', facilities: ['MCC-A', 'HP PNL', 'HWG-101', 'HT-102', 'OAM PNL'] },
  { name: '활성탄흡착지동', facilities: ['활성탄 #1', '활성탄 #2', '활성탄 #3', '환기설비'] },
  { name: '약품투입동', facilities: ['약품펌프 #1', '약품펌프 #2', '저장조'] },
  { name: '오존설비동', facilities: ['오존발생기 #1', '오존발생기 #2', '오존주입펌프'] },
  { name: '금속여과지동', facilities: ['여과지 #1', '여과지 #2', '역세펌프'] },
  { name: '송수펌프동', facilities: ['H1.PM1', 'H1.PM2', 'H1.PM3', 'H1.PM4'] },
  { name: '염소투입동', facilities: ['염소투입펌프 #1', '염소투입펌프 #2', '환기설비'] },
  { name: '탈수기동내부', facilities: ['탈수기 #1', '탈수기 #2', '컨베이어'] },
]

export function buildFacUsage(
  granularity: PumpPerformGranularity,
  facility = 0,
): FacUsageData {
  const intervalMs = granIntervalMs(granularity)
  const startMs = Date.now() - 11 * intervalMs
  const selectedIndex = Math.max(0, Math.min(FAC_CATEGORIES.length - 1, facility))
  const selectedFacilities = FAC_CATEGORIES[selectedIndex].facilities
  return {
    startMs,
    intervalMs,
    categories: FAC_CATEGORIES,
    selectedIndex,
    facilityTrend: selectedFacilities.map((name, i) => ({
      name,
      color: USAGE_PALETTE[i % USAGE_PALETTE.length],
      data: Array.from({ length: 12 }, () => 20 + Math.round(Math.random() * 180)),
    })),
    sumChart: selectedFacilities.map((name) => ({
      name,
      value: 1_000 + Math.round(Math.random() * 9_000),
    })),
    distributionChart: selectedFacilities.map((name) => ({
      name,
      value: 50 + Math.round(Math.random() * 250),
    })),
    streamChart: selectedFacilities.slice(0, 3).map((name, i) => ({
      name,
      color: USAGE_PALETTE[i % USAGE_PALETTE.length],
      data: Array.from({ length: 24 }, () => 30 + Math.round(Math.random() * 220)),
    })),
  }
}

const PROCESS_TITLES = ['송수', '응집', '여과', '오존', '소독']

export function buildUseTrend(granularity: PumpPerformGranularity): UseTrendData {
  const intervalMs = granIntervalMs(granularity)
  const startMs = Date.now() - 11 * intervalMs
  return {
    startMs,
    intervalMs,
    powerUsed: ['관리동', '송수펌프동', '오존설비동', '활성탄흡착지동'].map((name, i) => ({
      name,
      color: USAGE_PALETTE[i],
      data: Array.from({ length: 12 }, () => 60 + Math.round(Math.random() * 200)),
    })),
    powerPeak: ['금주', '금월', '금년'].map((name, i) => ({
      name,
      value: 1500 + (i + 1) * 800 + Math.round(Math.random() * 200),
    })),
    processes: PROCESS_TITLES.map((title) => {
      const all = 8_000 + Math.round(Math.random() * 6_000)
      const cost = Math.round(all * (95 + Math.random() * 20))
      const split = (factor: number) => Math.round(factor * 100) / 100
      const lightU = split(20 + Math.random() * 15)
      const midU = split(40 + Math.random() * 15)
      const peakU = Math.round((100 - lightU - midU) * 100) / 100
      return {
        title,
        allUsed: all,
        allCost: cost,
        loads: [
          {
            name: '경부하' as const,
            percentUsed: lightU,
            percentCost: split(lightU * 0.9),
            kwh: Math.round((all * lightU) / 100),
            cost: Math.round((cost * lightU * 0.9) / 100),
          },
          {
            name: '중간부하' as const,
            percentUsed: midU,
            percentCost: split(midU * 1.0),
            kwh: Math.round((all * midU) / 100),
            cost: Math.round((cost * midU) / 100),
          },
          {
            name: '최대부하' as const,
            percentUsed: peakU,
            percentCost: split(peakU * 1.3),
            kwh: Math.round((all * peakU) / 100),
            cost: Math.round((cost * peakU * 1.3) / 100),
          },
        ],
      }
    }),
  }
}

export function buildReport(from: string, to: string): ReportRow[] {
  const start = new Date(from).getTime()
  const end = new Date(to).getTime()
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return []
  const dayMs = 86_400_000
  const days = Math.min(Math.ceil((end - start) / dayMs) + 1, 31)
  const rows: ReportRow[] = []
  for (let d = 0; d < days; d++) {
    const date = new Date(start + d * dayMs).toISOString().slice(0, 10)
    for (let h = 0; h < 24; h += 4) {
      rows.push({
        date,
        hour: h,
        usage: 1100 + Math.round(Math.random() * 600),
        peak: 1500 + Math.round(Math.random() * 500),
        cost: Math.round((1100 + Math.random() * 600) * 105),
      })
    }
  }
  return rows
}
