import { useMutation, useQuery } from "@tanstack/react-query";
import { login, getUser, logout } from "./auth.service";

// 로그인
export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
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
