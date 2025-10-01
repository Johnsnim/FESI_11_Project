import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, signup } from "./auth.service";
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
