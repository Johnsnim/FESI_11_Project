import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, signup, updateUser } from "./auth.service";
import { useSession } from "next-auth/react";

//추후 수정해야함
interface ApiError {
  code: string;
  message: string;
  status?: number;
}

// 회원가입
export const useSignUpMutation = () =>
  useMutation<
    { message: string },
    ApiError,
    {
      email: string;
      password: string;
      name: string;
      companyName: string;
    }
  >({
    mutationFn: signup,
  });

// 내정보
export function useUserQuery() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["authUser"],
    queryFn: () => getUser(accessToken!),
    enabled: !!accessToken,
    retry: false,
  });
}

// 회원정보 수정

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useMutation({
    mutationFn: (payload: { companyName: string; image?: File }) =>
      updateUser(accessToken!, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data); // 최신화
    },
  });
};
