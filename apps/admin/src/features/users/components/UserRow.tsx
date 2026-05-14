import type { User } from '../types/user.schema'
import { formatRole } from '../utils/formatRole'

export function UserRow({ user }: { user: User }) {
  return (
    <li className='flex items-center justify-between border-b border-gray-200 py-3'>
      <div>
        <p className='font-medium'>{user.name}</p>
        <p className='text-sm text-gray-500'>{user.email}</p>
      </div>
      <span className='rounded bg-gray-100 px-2 py-1 text-xs'>{formatRole(user.role)}</span>
    </li>
  )
}
