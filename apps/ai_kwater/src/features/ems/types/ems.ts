// 원본: 성남정수장/src/store/aio/modules/ems/index.js (ems/latest 단일 엔드포인트)
// + 20 vue 파일에서 사용된 보조 도메인(cost / goal / tag / peak settings / report)

export type OperationMode = 0 | 1 | 2 // 0=AI분석 1=부분AI 2=AI

export interface EmsPump {
  h1_operation_mode: OperationMode | null
  h2_operation_mode: OperationMode | null
  /** 평택 H1 PM 4채널 */
  h1_pm1: number | null
  h1_pm2: number | null
  h1_pm3: number | null
  h1_pm4: number | null
  /** 안성 H2 PM 4채널 */
  h2_pm1: number | null
  h2_pm2: number | null
  h2_pm_sp1: number | null
  h2_pm_sp2: number | null
  /** AI 추천값 */
  ai_h1_pm1: number | null
  ai_h1_pm2: number | null
  ai_h1_pm3: number | null
  ai_h1_pm4: number | null
  ai_h2_pm1: number | null
  ai_h2_pm2: number | null
  ai_h2_pm_sp1: number | null
  ai_h2_pm_sp2: number | null
}

export interface EmsPeak {
  z_power1: number | null
  ai_z_power1: number | null
  ai_z_power_peak1: number | null
}

export interface EmsDr {
  z_cbl: number | null
  ai_z_dr_power: number | null
}

export interface EmsLatest {
  pump: EmsPump
  peak: EmsPeak
  dr: EmsDr
  /** 60분 power 시계열 */
  power_trend: Array<[number, number]>
  /** 60분 부하 시계열 */
  load_trend: Array<[number, number]>
  /** 60분 AI 추천 power 시계열 */
  ai_power_trend: Array<[number, number]>
}

export interface CostItem {
  month: string // YYYY-MM
  fee: number // 원
  usage: number // kWh
  peak: number // kW
  reduction: number // 절감 kWh
}

export interface CostSetting {
  baseRate: number // 기본요금 (원/kW)
  unitRate: number // 사용량 단가 (원/kWh)
  peakRate: number // 피크요금 (원/kW)
  drDiscount: number // DR 할인율 (%)
}

export interface GoalConfig {
  targetReductionPct: number // 절감 목표 (%)
  targetPeakKw: number // 피크 목표 (kW)
  targetCostKrw: number // 비용 목표 (원)
  fiscalYear: number
}

export interface PeakSetting {
  peakStartHour: number // 0-23
  peakEndHour: number // 0-23
  peakLimitKw: number
  drDispatchKw: number
  enabled: boolean
}

export interface EmsTag {
  id: string
  tag: string // SCADA tag
  label: string
  unit: string
  category: 'pump' | 'peak' | 'dr' | 'cost' | 'misc'
  enabled: boolean
}

export interface ReportRow {
  date: string // YYYY-MM-DD
  hour: number
  usage: number
  peak: number
  cost: number
}

/** Dashboard 좌측 상단 — 전력소비/전력절감/탄소절감 3블록 */
export interface EnergyFactor {
  /** 사용량 (kWh) */
  todayUsage: number
  monthUsage: number
  yearUsage: number
  /** 절감 (kWh) */
  todaySave: number
  monthSave: number
  yearSave: number
  /** 탄소 (kg) */
  todayCo2: number
  monthCo2: number
  yearCo2: number
  /** 목표대비 (%) */
  dayPct: number
  monthPct: number
  yearPct: number
  /** 현재 즉시 전력 (kW) */
  nowKw: number
}

/** 정수장 zone (건물) */
export type ZoneCode = '탈수기동' | '오존설비동' | '관리동' | '송수펌프동' | '염소투입동' | '원수동'

export interface ZoneFacility {
  name: string
  usageKwh: number
}

export interface Zone {
  code: ZoneCode
  /** 0-100, 막대 차트 % */
  usagePct: number
  totalKwh: number
  /** TOP3 시설 */
  top3: ZoneFacility[]
}

/** 배수지 */
export type ReservoirName = '봉담2' | '남양6' | '마도'

export interface Reservoir {
  name: ReservoirName
  /** 수위 % */
  levelPct: number
  /** 24h 사용량 시계열 */
  usageTrend: Array<[number, number]>
  /** 현재 유량 (m³/h) */
  flowRate: number
}

/** DR 참여 / 피크 제어 시계열 */
export interface DrParticipation {
  /** 60분 DR power */
  drTrend: Array<[number, number]>
  /** 60분 피크 power */
  peakTrend: Array<[number, number]>
  /** 60분 CBL */
  cblTrend: Array<[number, number]>
  /** 60분 AI 추천 */
  aiTrend: Array<[number, number]>
}

export interface EnergyFactorResponse {
  factor: EnergyFactor
}
export interface ZoneListResponse {
  zones: Zone[]
}
export interface ReservoirListResponse {
  reservoirs: Reservoir[]
}
export interface DrParticipationResponse {
  dr: DrParticipation
}

/** Analysis 페이지 — 송수펌프 제어 분석 */
export type ValveState = 'on' | 'off'

export interface AnalysisValve {
  id: string // ex: 745-617-LEI-8982
  state: ValveState
  /** 개도율 (%) */
  opening: number
  /** 물줄기 애니메이션 활성 (state=on AND opening>0) */
  flowing: boolean
}

export type AnalysisReservoirName = '봉담' | '남양6' | '남양6_2' | '마도'

export interface AnalysisReservoir {
  name: AnalysisReservoirName
  /** 최소요구관압 (kg/cm2) */
  minRequiredPressure: number
  /** 유입유량 (m3/h) */
  inflow: number
  /** 2 밸브 */
  valves: [AnalysisValve, AnalysisValve]
  /** 수위 상/하 (m) */
  waterLevels: [number, number]
  /** 유출유량 (m3/h) */
  outflow: number
}

export interface AnalysisStation {
  /** 관압 (kg/cm2) */
  pressure: number
  /** 유량 (m3) */
  flow: number
  /** 펌프 가동 상태 (true=ON) — 평택 4 / 송산 2 */
  activePumps: boolean[]
  /** 주파수 Hz (평택은 사용 X — 빈 배열, 송산은 2개) */
  freq: number[]
}

export interface AnalysisAiSuggestion {
  pressure: number
  flow: number
  /** AI 추천 펌프 ON/OFF */
  pumps: boolean[]
  /** AI Hz (송산만) */
  freq: number[]
}

export interface AnalysisRequiredPressure {
  /** 최소요구관압 기준 배수지명 */
  baseReservoir: AnalysisReservoirName
  /** 분기점 (kg/cm2) */
  branchPoint: number
  /** 최소요구관압 (kg/cm2) */
  minPressure: number
}

export interface AnalysisEnergyTrend {
  /** ms timestamp 75포인트 (주 단위, 18개월) */
  startMs: number
  intervalMs: number
  /** 기준원단위 (kWh/m3) */
  baseline: Array<number | null>
  /** 현재월단위 (kWh/m3) */
  current: Array<number | null>
  /** 절감량 (kWh) — area */
  saving: Array<number | null>
}

export interface AnalysisData {
  pyeongtaek: AnalysisStation
  pyeongtaekAi: AnalysisAiSuggestion
  songsan: AnalysisStation
  songsanAi: AnalysisAiSuggestion
  reservoirs: AnalysisReservoir[]
  required: AnalysisRequiredPressure
  energyTrend: AnalysisEnergyTrend
}

export interface AnalysisResponse {
  analysis: AnalysisData
}

/** Songsu 페이지 — 송수 펌프 운영 */
export interface SongsuPumpState {
  /** 예상 또는 실제 전력 (kW) */
  power: number
  /** 관압 (kg/cm2) */
  pressure: number
  /** 유량 (m3) */
  flow: number
  /** 펌프 ON/OFF — 평택 4 / 송산 2 */
  pumps: boolean[]
  /** Hz (송산만) */
  freq: number[]
}

export interface SongsuStation {
  /** 현재 운영 상태 */
  current: SongsuPumpState
  /** AI 추천 */
  ai: SongsuPumpState
}

export type AiOperationMode = 'auto' | 'semi'

export interface AiOperationConfig {
  enabled: boolean
  mode: AiOperationMode
}

export type SongsuReservoirName =
  | '봉담2'
  | '남양6'
  | '마도'
  | '배양'
  | '광평'
  | '비봉'
  | '동화'
  | '남양5'
  | '문호'
  | '상리'

export interface SongsuValve {
  /** 0-100 % */
  opening: number
  state: ValveState
}

/** 한 라인 (배수지가 multi-line 인 경우 line=2,3) */
export interface SongsuReservoirLine {
  /** 유입유량 m3/h */
  inflow: number | null
  /** 좌측 밸브 2개 */
  valvesIn: [SongsuValve | null, SongsuValve | null]
  /** 수위 m (상/하) */
  waterLevels: [number | null, number | null]
  /** 우측 밸브 2개 */
  valvesOut: [SongsuValve | null, SongsuValve | null]
  /** 유출유량 m3/h */
  outflow: number | null
}

export interface SongsuReservoir {
  name: SongsuReservoirName
  /** 표시 가격(첫 라인에만 표시될 라벨 옆 수치) */
  headerValue: number | null
  lines: SongsuReservoirLine[]
}

export interface SongsuPipeFlow {
  /** 평택 → 배수지 흐름 강도 0-1 */
  pyeongtaekFlow: number
  /** 송산 → 배수지 흐름 강도 0-1 */
  songsanFlow: number
}

export interface SongsuData {
  pyeongtaek: SongsuStation
  songsan: SongsuStation
  aiOperation: {
    pyeongtaek: AiOperationConfig
    songsan: AiOperationConfig
  }
  pipe: SongsuPipeFlow
  reservoirs: SongsuReservoir[]
}

export interface SongsuResponse {
  songsu: SongsuData
}

/** PumpPerform 페이지 — 송수펌프 가동이력 */
export type PumpPerformGranularity = 'hour' | 'day' | 'month' | 'year'

export interface PumpGaugeItem {
  name: string
  /** 효율 게이지 % */
  pumpingGaugeValue: number
  /** 정격양정 (m) */
  pumpingHead: number
  /** 정격유량 (m³) */
  pumpingStream: number
}

export interface PumpPerformSeries {
  name: string
  color: string
  /** 시계열 데이터 — 12 포인트(분석 granularity 별) */
  data: number[]
}

export interface PumpRuntimeSegment {
  /** width % (0-100) */
  duration: number
  on: boolean
}

export interface PumpRuntimeRow {
  name: string
  segments: PumpRuntimeSegment[]
}

export interface PumpPerformData {
  /** 차트 x축 시작 ms */
  startMs: number
  /** 포인트 간격 ms */
  intervalMs: number
  /** 6 펌프 게이지 */
  gauges: PumpGaugeItem[]
  /** 전력사용량 area chart 6 시리즈 (평택4 + 송산2) */
  powerMileage: PumpPerformSeries[]
  /** 송산 Hz line chart 2 시리즈 */
  hzTrend: PumpPerformSeries[]
  /** 가동시간대 bar chart 6 행 */
  runtimeBars: PumpRuntimeRow[]
}

export interface PumpPerformResponse {
  perform: PumpPerformData
}

/** SujiSelect 페이지 — 송수펌프 제어 트렌드 */
export interface SujiTrendItem {
  key: 'level' | 'inflow' | 'valve' | 'outflow' | 'pressure' | 'pumpCount'
  label: string
  unit: string
  values: number[]
}

export interface SujiInstantValue {
  name: string
  value: number
  unit: string
}

export interface SujiSelectData {
  granularity: PumpPerformGranularity
  startMs: number
  intervalMs: number
  trends: SujiTrendItem[]
  instant: SujiInstantValue[]
}

export interface SujiSelectResponse {
  suji: SujiSelectData
}

/** SujiSelect2 페이지 — 주요 배수지 수위 현황 */
export interface ReservoirDistributionItem {
  name: string
  /** 수위 m */
  levelM: number
  /** 용량 대비 % */
  capacityPct: number
}

export interface ReservoirInstantItem {
  name: string
  levelM: number
  unit: string
}

export interface SujiSelect2Data {
  /** 14 배수지 명칭 */
  reservoirs: string[]
  /** 선택된 배수지명 */
  selected: string
  /** 선택된 배수지의 수위 시계열 */
  selectedTrend: {
    startMs: number
    intervalMs: number
    levels: number[]
  }
  /** 14 배수지 분포 */
  distribution: ReservoirDistributionItem[]
  /** 7 주요 배수지 순시 */
  instant: ReservoirInstantItem[]
}

export interface SujiSelect2Response {
  suji2: SujiSelect2Data
}

/** Zone Usage 페이지 — 시설별 사용량 */
export interface ZoneRow {
  name: string
  /** 순시 전력 kW */
  instantKw: number
  /** 전력량 kWh */
  totalKwh: number
  /** 시간당 최대전력 kW */
  hourlyPeakKw: number
  /** 최대 전력 시간대 */
  peakHourDate: string
}

export interface ChartCategoryValue {
  name: string
  value: number
  /** drilldown 1depth — 하위 카테고리 */
  children?: ChartCategoryValue[]
}

export interface ChartTrendSeries {
  name: string
  color: string
  data: number[]
}

export interface ZoneUsageData {
  startMs: number
  intervalMs: number
  totalKwh: number
  zones: ZoneRow[]
  sumChart: ChartCategoryValue[]
  distributionChart: ChartCategoryValue[]
  trendChart: ChartTrendSeries[]
}

export interface ZoneUsageResponse {
  zoneUsage: ZoneUsageData
}

/** Facility Usage 페이지 — 설비별 사용량 */
export interface FacilityCategory {
  name: string
  /** 설비 명칭 목록 */
  facilities: string[]
}

export interface FacUsageData {
  startMs: number
  intervalMs: number
  /** 8 시설 카테고리 */
  categories: FacilityCategory[]
  /** 선택된 시설 인덱스 */
  selectedIndex: number
  /** 선택된 시설의 설비 트렌드 */
  facilityTrend: ChartTrendSeries[]
  /** 하단 3 차트 */
  sumChart: ChartCategoryValue[]
  distributionChart: ChartCategoryValue[]
  streamChart: ChartTrendSeries[]
}

export interface FacUsageResponse {
  facUsage: FacUsageData
}

/** Use Trend 페이지 — 사용량 트렌드 */
export interface ProcessLoad {
  title: string
  /** 전체 사용량 / 비용 */
  allUsed: number
  allCost: number
  /** 경부하 / 중간부하 / 최대부하 */
  loads: Array<{
    name: '경부하' | '중간부하' | '최대부하'
    percentUsed: number
    percentCost: number
    kwh: number
    cost: number
  }>
}

export interface UseTrendData {
  startMs: number
  intervalMs: number
  /** col-8 전력 사용량 area chart 시리즈 (공정별) */
  powerUsed: ChartTrendSeries[]
  /** col-4 최대 피크 bar */
  powerPeak: ChartCategoryValue[]
  /** 공정별 부하 카드 4~6 */
  processes: ProcessLoad[]
}

export interface UseTrendResponse {
  useTrend: UseTrendData
}

export interface EmsLatestResponse {
  latest: EmsLatest
}
export interface CostListResponse {
  items: CostItem[]
}
export interface CostSettingResponse {
  setting: CostSetting
}
export interface GoalConfigResponse {
  goal: GoalConfig
}
export interface PeakSettingResponse {
  peak: PeakSetting
}
export interface TagListResponse {
  tags: EmsTag[]
}
export interface ReportResponse {
  rows: ReportRow[]
}
