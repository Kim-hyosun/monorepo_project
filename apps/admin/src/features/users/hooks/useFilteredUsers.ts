import { useMemo } from 'react'
import { useUsersFilterStore } from '../store/usersFilterStore'
import { useUsersQuery } from '../queries/useUsersQuery'

export function useFilteredUsers() {
  const { data, ...rest } = useUsersQuery()
  const search = useUsersFilterStore((s) => s.search)

  const filtered = useMemo(() => {
    if (!data) return []
    if (!search) return data
    return data.filter((u) => u.name.includes(search) || u.email.includes(search))
  }, [data, search])

  return { users: filtered, ...rest }
}
