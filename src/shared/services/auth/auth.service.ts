import { api } from "@/lib/api/api";
import { useAuthStore } from "@/shared/store/auth.store";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

export class AuthService {
  async login(email: string, password: string): Promise<{ token: string }> {
    const { data } = await api.post<{ token: string }>(
      `/${TEAM_ID}/auths/signin`,
      { email, password },
    );
    useAuthStore.getState().setToken(data.token);
    localStorage.setItem("accessToken", data.token);
    return data;
  }
}

export const authService = new AuthService();
