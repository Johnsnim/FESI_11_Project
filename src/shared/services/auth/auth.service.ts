import { api } from "@/lib/api/api"
import { useAuthStore } from "@/shared/store/auth.store"

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID

// 로그인
export async function login(email: string, password: string) {
  const { data } = await api.post<{ token?: string; message?: string }>(
    `/${TEAM_ID}/auths/signin`,
    { email, password }
  )

  if (data.token) {
    useAuthStore.getState().setToken(data.token)
    localStorage.setItem("accessToken", data.token)
  }

  return data
}

// 내 정보
export async function getUser() {
  const { data } = await api.get(`/${TEAM_ID}/auths/user`)
  useAuthStore.getState().setUser(data)
  return data
}

// 로그아웃
export async function logout() {
  await api.post(`/${TEAM_ID}/auths/signout`)
  useAuthStore.getState().clearAuth()
  localStorage.removeItem("accessToken")
}
