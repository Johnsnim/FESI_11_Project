import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getUser, signup, updateUser } from "./auth.service";

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

// 내 정보 조회
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
  const { data: session, update } = useSession();
  const accessToken = session?.accessToken;

  return useMutation({
    mutationFn: (payload: { companyName: string; image?: string | File }) => {
      const file = payload.image instanceof File ? payload.image : undefined;
      return updateUser(accessToken!, {
        companyName: payload.companyName,
        image: file,
      });
    },
    onSuccess: async (data) => {
      // 1. React Query 캐시 업데이트
      queryClient.setQueryData(["authUser"], data);

      // 2. NextAuth 세션 업데이트
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          companyName: data.companyName,
          image: data.image,
        },
      });

      // 3. 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};
