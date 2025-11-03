import { api } from "@/lib/api/api";
import { AxiosError } from "axios";

export interface ApiError extends Error {
  code: string;
  status?: number;
  parameter?: string;
}
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

//회원가입
export const signup = async (data: {
  email: string;
  password: string;
  name: string;
  companyName: string;
}): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/${TEAM_ID}/auths/signup`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;

      const apiError = new Error(
        errorData?.message || "회원가입에 실패했습니다",
      ) as ApiError;
      apiError.code = errorData?.code || "SIGNUP_ERROR";
      apiError.status = error.response?.status;
      apiError.parameter = errorData?.parameter;
      apiError.name = "ApiError";

      throw apiError;
    }
    throw error;
  }
};

//내정보
export async function getUser(accessToken: string) {
  const { data } = await api.get(`/${TEAM_ID}/auths/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

//회원정보 수정
export async function updateUser(
  accessToken: string,
  payload: { companyName: string; image?: string | File },
) {
  const formData = new FormData();
  formData.append("companyName", payload.companyName);

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  const { data } = await api.put(`/${TEAM_ID}/auths/user`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
