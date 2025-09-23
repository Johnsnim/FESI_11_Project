import { useMutation, useQuery } from "@tanstack/react-query";
import { login, getUser, logout } from "./auth.service";

interface ApiError {
  code: string;
  message: string;
  status?: number;
}
// 로그인
export const useLoginMutation = () =>
  useMutation<
    { token?: string; message?: string }, // data
    ApiError, // error
    { email: string; password: string } // variables
  >({
    mutationFn: ({ email, password }) => login(email, password),
  });
// 내 정보
export const useUserQuery = () =>
  useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    retry: false,
  });

// 로그아웃
export const useLogoutMutation = () =>
  useMutation({
    mutationFn: logout,
  });
