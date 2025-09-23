import { create } from "zustand"

interface User {
  id: number
  email: string
  name: string
  companyName?: string
  image?: string
}

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  clearAuth: () => set({ token: null, user: null }),
}))
