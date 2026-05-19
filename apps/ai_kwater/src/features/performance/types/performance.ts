// 원본: 성남정수장/src/store/aio/modules/performance.js + sub/* 컴포넌트의 데이터 키 추정.

export interface SystemInfo {
  hostname: string
  name: string
  cpu_model?: string
  cpu_cores?: number
  memory_total?: number
  os?: string
}

export interface ResourceInfo {
  systemInfo: SystemInfo
}

export interface ResourcesInfoResponse {
  resources: ResourceInfo[]
}

/** 호스트별 모니터링 시계열 (cpu/memory/disk 사용률 등). 원본은 type 코드(1=CPU, 2=MEMORY, …) 별 시리즈. */
export interface MonitoringPoint {
  timestamp: string
  type: number
  value: number
}

export interface MonitoringResponse {
  monitoring: MonitoringPoint[]
}

/** 최근 모니터링 (서버 전체). 원본은 호스트별 type 그룹. */
export interface MonitoringLatestEntry {
  hostname: string
  type: number
  value: number
  timestamp: string
}

export interface MonitoringLatestResponse {
  monitoring: MonitoringLatestEntry[]
}

export interface UpdateResourceNamePayload {
  name: string
}

/** 원본 store 의 type enum 그대로. */
export const PERFORMANCE_TYPE = {
  CPU: 1,
  MEMORY: 2,
  DISK: 3,
  ETHERNET_SENT: 4,
  ETHERNET_RECV: 5,
  ANALYSYSTEM_DB: 11,
  VISUALIZATION_API: 12,
  DAQ: 13,
} as const
