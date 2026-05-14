import { create } from 'zustand'

interface UsersFilterState {
  search: string
  setSearch: (value: string) => void
}

export const useUsersFilterStore = create<UsersFilterState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))
