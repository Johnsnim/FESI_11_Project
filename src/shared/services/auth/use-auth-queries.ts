import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, getUser, logout, signup } from "./auth.service";
import { useAuthStore } from "@/shared/store/auth.store";

interface ApiError {
  code: string;
  message: string;
  status?: number;
}

// 로그인
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { token?: string },
    ApiError,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data.token) {
        const user = await getUser();
        queryClient.setQueryData(["authUser"], user);
      }
    },
  });
};

// 내 정보
export const useUserQuery = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    enabled: !!token,
    retry: false,
  });
};

// 로그아웃
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null); // 즉시 반영
    },
  });
};

// 회원가입
export const useSignUpMutation = () =>
  useMutation<{ message: string }, ApiError, {
    email: string;
    password: string;
    name: string;
    companyName: string;
  }>({
    mutationFn: signup,
  });