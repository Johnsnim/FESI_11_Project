import { api } from "@/lib/api/api"
import { useAuthStore } from "@/shared/store/auth.store"

export class AuthService {
  async login(email: string, password: string): Promise<{ token: string }> {
    const { data } = await api.post<{ token: string }>(
      "/team4/auths/signin",
      { email, password },
    )
    // Zustand + localStorage에 저장
    useAuthStore.getState().setToken(data.token)
    localStorage.setItem("accessToken", data.token)
    return data
  }
}

export const authService = new AuthService()
