import type { User } from '@/features/users/types/user'

export const seedUsers: User[] = [
  { userid: 'admin', name: '관리자', partname: '시스템', authority: 9 },
  { userid: 'kim1', name: '김철수', partname: '수처리과', authority: 0 },
  { userid: 'lee1', name: '이영희', partname: '수처리과', authority: 0 },
  { userid: 'park1', name: '박지민', partname: '운영과', authority: 0 },
  { userid: 'choi1', name: '최동훈', partname: '운영과', authority: 0 },
  { userid: 'jung1', name: '정수아', partname: '에너지관리', authority: 0 },
  { userid: 'yoon1', name: '윤재호', partname: '에너지관리', authority: 0 },
  { userid: 'han1', name: '한지수', partname: '품질관리', authority: 0 },
  { userid: 'oh1', name: '오민석', partname: '품질관리', authority: 0 },
  { userid: 'kang1', name: '강하늘', partname: '시설관리', authority: 0 },
]
