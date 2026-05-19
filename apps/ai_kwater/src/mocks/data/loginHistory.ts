import type { LoginHistoryEntry } from '@/features/loginHistory/types/loginHistory'

const baseDate = new Date('2026-05-15T09:00:00').getTime()

/**
 * 원본 LoginHistory.vue 는 item.type (1=로그인, 0=로그아웃) / item.timestamp / item.userid / item.address 를 표시.
 * 신규 시드는 두 필드 그룹(원본 + 보조) 을 모두 채워 호환성 확보.
 */
export const seedLoginHistory: LoginHistoryEntry[] = [
  { login_history_index: 1, type: 1, userid: 'admin', partname: '시스템', name: '관리자', login_time: new Date(baseDate).toISOString(), logout_time: new Date(baseDate + 3600_000).toISOString(), ip: '10.0.0.1', timestamp: new Date(baseDate).toISOString(), address: '10.0.0.1' },
  { login_history_index: 2, type: 0, userid: 'admin', partname: '시스템', name: '관리자', login_time: new Date(baseDate).toISOString(), logout_time: new Date(baseDate + 3600_000).toISOString(), ip: '10.0.0.1', timestamp: new Date(baseDate + 3600_000).toISOString(), address: '10.0.0.1' },
  { login_history_index: 3, type: 1, userid: 'kim1', partname: '수처리과', name: '김철수', login_time: new Date(baseDate + 7200_000).toISOString(), logout_time: null, ip: '10.0.0.42', timestamp: new Date(baseDate + 7200_000).toISOString(), address: '10.0.0.42' },
  { login_history_index: 4, type: 1, userid: 'lee1', partname: '수처리과', name: '이영희', login_time: new Date(baseDate + 10_800_000).toISOString(), logout_time: new Date(baseDate + 14_400_000).toISOString(), ip: '10.0.0.43', timestamp: new Date(baseDate + 10_800_000).toISOString(), address: '10.0.0.43' },
  { login_history_index: 5, type: 0, userid: 'lee1', partname: '수처리과', name: '이영희', login_time: new Date(baseDate + 10_800_000).toISOString(), logout_time: new Date(baseDate + 14_400_000).toISOString(), ip: '10.0.0.43', timestamp: new Date(baseDate + 14_400_000).toISOString(), address: '10.0.0.43' },
  { login_history_index: 6, type: 1, userid: 'park1', partname: '운영과', name: '박지민', login_time: new Date(baseDate + 86_400_000).toISOString(), logout_time: new Date(baseDate + 90_000_000).toISOString(), ip: '10.0.0.50', timestamp: new Date(baseDate + 86_400_000).toISOString(), address: '10.0.0.50' },
  { login_history_index: 7, type: 0, userid: 'park1', partname: '운영과', name: '박지민', login_time: new Date(baseDate + 86_400_000).toISOString(), logout_time: new Date(baseDate + 90_000_000).toISOString(), ip: '10.0.0.50', timestamp: new Date(baseDate + 90_000_000).toISOString(), address: '10.0.0.50' },
  { login_history_index: 8, type: 1, userid: 'choi1', partname: '운영과', name: '최동훈', login_time: new Date(baseDate + 172_800_000).toISOString(), logout_time: null, ip: '10.0.0.51', timestamp: new Date(baseDate + 172_800_000).toISOString(), address: '10.0.0.51' },
]
