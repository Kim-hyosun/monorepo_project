export interface RouteMeta {
  path: string
  label: string
  group: 'aio' | 'pms' | 'ems' | 'poc'
}

export const aioRoutes: RouteMeta[] = [
  { path: '/', label: 'Dashboard', group: 'aio' },
  { path: '/operationboard', label: '주요감시현황', group: 'aio' },
  { path: '/receivingAlgorithm', label: '착수 — 알고리즘', group: 'aio' },
  { path: '/receivingAlgorithmS', label: '착수 — 알고리즘(S)', group: 'aio' },
  { path: '/cgAlgorithm', label: '응집 — 알고리즘', group: 'aio' },
  { path: '/cgAlgorithmS', label: '응집 — 알고리즘(S)', group: 'aio' },
  { path: '/cgSimulation', label: '응집 — 시뮬레이션', group: 'aio' },
  { path: '/mtccAlgorithm', label: '혼화지 — 알고리즘', group: 'aio' },
  { path: '/mtccAlgorithmS', label: '혼화지 — 알고리즘(S)', group: 'aio' },
  { path: '/sedimentationAlgorithm', label: '침전지 — 알고리즘', group: 'aio' },
  { path: '/sedimentationAlgorithmS', label: '침전지 — 알고리즘(S)', group: 'aio' },
  { path: '/filterAlgorithm', label: '여과지 — 알고리즘', group: 'aio' },
  { path: '/filterAlgorithmS', label: '여과지 — 알고리즘(S)', group: 'aio' },
  { path: '/ozoneAlgorithm', label: '오존 — 알고리즘', group: 'aio' },
  { path: '/gacAlgorithm', label: 'GAC — 알고리즘', group: 'aio' },
  { path: '/disinfectionAlgorithm', label: '소독 — 알고리즘', group: 'aio' },
  { path: '/disinfectionAlgorithmS', label: '소독 — 알고리즘(S)', group: 'aio' },
  { path: '/alarmHistory', label: '알람 이력', group: 'aio' },
  { path: '/alarmManagement', label: '알람 관리', group: 'aio' },
  { path: '/userManagement', label: '사용자 관리', group: 'aio' },
  { path: '/loginHistory', label: '로그인 이력', group: 'aio' },
  { path: '/configNetwork', label: '네트워크 설정', group: 'aio' },
  { path: '/performanceMonitoring', label: '성능 모니터링', group: 'aio' },
]

export const pmsRoutes: RouteMeta[] = [
  { path: '/pms', label: 'PMS Dashboard', group: 'pms' },
  { path: '/Monitoring', label: 'Monitoring', group: 'pms' },
  ...[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map<RouteMeta>((n) => ({
    path: `/monitor${n}`,
    label: `Monitor ${n}`,
    group: 'pms',
  })),
  ...[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18].map<RouteMeta>((n) => ({
    path: `/detail${n}`,
    label: `Detail ${n}`,
    group: 'pms',
  })),
]

export const emsRoutes: RouteMeta[] = [
  { path: '/ems', label: 'EMS Dashboard', group: 'ems' },
  { path: '/analysis', label: '분석', group: 'ems' },
  { path: '/songsu', label: '송수', group: 'ems' },
  { path: '/sujiSelect', label: '수지 선택', group: 'ems' },
  { path: '/sujiSelect_2', label: '수지 선택 2', group: 'ems' },
  { path: '/pumpPerform', label: '펌프 성능', group: 'ems' },
  { path: '/peakControl', label: '피크 제어', group: 'ems' },
  { path: '/peak', label: '피크', group: 'ems' },
  { path: '/zoneUse', label: '구역 사용량', group: 'ems' },
  { path: '/useTrand', label: '사용 추이', group: 'ems' },
  { path: '/facUse', label: '시설 사용량', group: 'ems' },
  { path: '/cost', label: '비용', group: 'ems' },
  { path: '/reduction', label: '절감', group: 'ems' },
  { path: '/tableEMS', label: 'EMS 테이블', group: 'ems' },
  { path: '/tagSetting', label: '태그 설정', group: 'ems' },
  { path: '/pumpOperation', label: '펌프 운영', group: 'ems' },
  { path: '/costSetting', label: '비용 설정', group: 'ems' },
  { path: '/goalSetting', label: '목표 설정', group: 'ems' },
  { path: '/peak_set', label: '피크 설정', group: 'ems' },
  { path: '/report', label: '리포트', group: 'ems' },
]

export const pocRoutes: RouteMeta[] = [
  { path: '/chart-demo', label: 'Chart Demo (PoC)', group: 'poc' },
]

export const allRoutes: RouteMeta[] = [
  ...aioRoutes,
  ...pmsRoutes,
  ...emsRoutes,
  ...pocRoutes,
]

export function findRouteMeta(pathname: string): RouteMeta | undefined {
  return allRoutes.find((r) => r.path === pathname)
}
