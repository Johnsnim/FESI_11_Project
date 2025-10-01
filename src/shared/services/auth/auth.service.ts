import { api } from "@/lib/api/api";
import { useAuthStore } from "@/shared/store/auth.store";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

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
    { email, password, name, companyName },
  );
  return data;
}

//내정보
export async function getUser(accessToken: string) {
  const { data } = await api.get(`/${process.env.NEXT_PUBLIC_TEAM_ID}/auths/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}