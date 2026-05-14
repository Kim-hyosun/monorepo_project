import type { User } from '../types/user.schema'

export function formatRole(role: User['role']): string {
  return role === 'admin' ? '관리자' : '직원'
}
