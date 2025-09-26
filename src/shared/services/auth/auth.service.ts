import { api } from "@/lib/api/api";
import { useAuthStore } from "@/shared/store/auth.store";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

// 로그인
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await api.post<{ token?: string }>(
    `/${TEAM_ID}/auths/signin`,
    { email, password }
  );

  if (data.token) {
    useAuthStore.getState().setToken(data.token); // zustand + persist 저장
  }

  return data;
}

// 내 정보
export async function getUser() {
  const { data } = await api.get(`/${TEAM_ID}/auths/user`);
  useAuthStore.getState().setUser(data); // zustand 업데이트
  return data;
}

// 로그아웃
export async function logout() {
  useAuthStore.getState().clearAuth();
  return { message: "로그아웃 성공" };
}

//회원가입
export async function signup({
  email,
  password,
  name,
  companyName,
}: {
  email: string;
  password: string;
  name: string;
  companyName: string;
}) {
  const { data } = await api.post<{ message: string }>(
    `/${TEAM_ID}/auths/signup`,
    { email, password, name, companyName }
  );

  return data;
}