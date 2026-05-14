'use client'

import { Button } from '@monorepo/ui'
import { UserRow } from '../components/UserRow'
import { useFilteredUsers } from '../hooks/useFilteredUsers'
import { useUsersFilterStore } from '../store/usersFilterStore'

export function UsersListPage() {
  const { users, isLoading } = useFilteredUsers()
  const { search, setSearch } = useUsersFilterStore()

  return (
    <main className='mx-auto max-w-2xl p-8'>
      <h1 className='mb-6 text-2xl font-bold'>Users</h1>
      <div className='mb-4 flex gap-2'>
        <input
          className='flex-1 rounded border border-gray-300 px-3 py-2'
          placeholder='이름/이메일 검색'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant='secondary' onClick={() => setSearch('')}>
          Clear
        </Button>
      </div>
      {isLoading ? (
        <p className='text-gray-500'>Loading...</p>
      ) : (
        <ul>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
          {users.length === 0 && <li className='py-4 text-gray-500'>No users</li>}
        </ul>
      )}
    </main>
  )
}
