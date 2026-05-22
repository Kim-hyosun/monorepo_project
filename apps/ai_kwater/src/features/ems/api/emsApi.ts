// 원본: 성남정수장/src/store/aio/modules/ems/index.js + 20 vue 파일에서 사용된 보조 endpoint들
// 모든 endpoint MSW mock (phase G).

import { api } from '@/libs/axios/instance'
import type {
  AiOperationConfig,
  AnalysisResponse,
  CostListResponse,
  CostSetting,
  CostSettingResponse,
  DrParticipationResponse,
  EmsLatestResponse,
  EmsTag,
  EnergyFactorResponse,
  GoalConfig,
  GoalConfigResponse,
  PeakSetting,
  PeakSettingResponse,
  FacUsageResponse,
  PumpPerformGranularity,
  PumpPerformResponse,
  ReportResponse,
  ReservoirListResponse,
  SongsuResponse,
  SujiSelect2Response,
  SujiSelectResponse,
  TagListResponse,
  UseTrendResponse,
  ZoneListResponse,
  ZoneUsageResponse,
} from '@/features/ems/types/ems'

export const emsApi = {
  getLatest: () => api.get<EmsLatestResponse>('/ems/latest').then((res) => res.data),
  listCosts: () => api.get<CostListResponse>('/ems/costs').then((res) => res.data),
  getCostSetting: () =>
    api.get<CostSettingResponse>('/ems/cost-setting').then((res) => res.data),
  updateCostSetting: (setting: CostSetting) =>
    api.put<CostSettingResponse>('/ems/cost-setting', setting).then((res) => res.data),
  getGoal: () => api.get<GoalConfigResponse>('/ems/goal').then((res) => res.data),
  updateGoal: (goal: GoalConfig) =>
    api.put<GoalConfigResponse>('/ems/goal', goal).then((res) => res.data),
  getPeakSetting: () => api.get<PeakSettingResponse>('/ems/peak-setting').then((res) => res.data),
  updatePeakSetting: (peak: PeakSetting) =>
    api.put<PeakSettingResponse>('/ems/peak-setting', peak).then((res) => res.data),
  listTags: () => api.get<TagListResponse>('/ems/tags').then((res) => res.data),
  updateTag: (id: string, patch: Partial<EmsTag>) =>
    api.put<TagListResponse>(`/ems/tags/${id}`, patch).then((res) => res.data),
  getReport: (from: string, to: string) =>
    api
      .get<ReportResponse>('/ems/report', { params: { from, to } })
      .then((res) => res.data),
  updateOperationMode: (channel: 'h1' | 'h2', mode: 0 | 1 | 2) =>
    api
      .put<EmsLatestResponse>(`/ems/operation/${channel}`, { mode })
      .then((res) => res.data),
  getFactor: () => api.get<EnergyFactorResponse>('/ems/factors').then((res) => res.data),
  listZones: () => api.get<ZoneListResponse>('/ems/zones').then((res) => res.data),
  listReservoirs: () =>
    api.get<ReservoirListResponse>('/ems/reservoirs').then((res) => res.data),
  getDrParticipation: () =>
    api.get<DrParticipationResponse>('/ems/dr-participation').then((res) => res.data),
  getAnalysis: () => api.get<AnalysisResponse>('/ems/analysis').then((res) => res.data),
  getSongsu: () => api.get<SongsuResponse>('/ems/songsu').then((res) => res.data),
  updateSongsuAiOperation: (
    station: 'pyeongtaek' | 'songsan',
    config: AiOperationConfig,
  ) =>
    api
      .put<SongsuResponse>(`/ems/songsu/ai/${station}`, config)
      .then((res) => res.data),
  getPumpPerform: (granularity: PumpPerformGranularity, from?: string, to?: string) =>
    api
      .get<PumpPerformResponse>('/ems/pump-perform', {
        params: { granularity, from, to },
      })
      .then((res) => res.data),
  getSujiSelect: (granularity: PumpPerformGranularity, from?: string, to?: string) =>
    api
      .get<SujiSelectResponse>('/ems/suji-select', {
        params: { granularity, from, to },
      })
      .then((res) => res.data),
  getSujiSelect2: (reservoir?: string) =>
    api
      .get<SujiSelect2Response>('/ems/suji-select2', {
        params: { reservoir },
      })
      .then((res) => res.data),
  getZoneUsage: (granularity: PumpPerformGranularity, from?: string, to?: string) =>
    api
      .get<ZoneUsageResponse>('/ems/zone-usage', {
        params: { granularity, from, to },
      })
      .then((res) => res.data),
  getFacUsage: (
    granularity: PumpPerformGranularity,
    facility: number,
    from?: string,
    to?: string,
  ) =>
    api
      .get<FacUsageResponse>('/ems/fac-usage', {
        params: { granularity, facility, from, to },
      })
      .then((res) => res.data),
  getUseTrend: (granularity: PumpPerformGranularity, from?: string, to?: string) =>
    api
      .get<UseTrendResponse>('/ems/use-trend', {
        params: { granularity, from, to },
      })
      .then((res) => res.data),
}
