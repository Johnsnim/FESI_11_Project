"use client";

import LogInForm from "@/features/auth/components/login-form";
import { useLoginMutation } from "@/shared/services/auth/use-auth-queries";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const login = useLoginMutation();

  const handleSubmit = (values: { email: string; password: string }) => {
    login.mutate(values, {
      onSuccess: () => {
        alert("로그인됨~");
        router.push("/");
      },
      onError: (error) => {
        alert("로그인 실패: " + (error as Error).message);
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center gap-8 px-4 pt-8 pb-8 md:gap-12 md:px-22 md:pt-10 lg:flex-row lg:items-center">
      <img
        src="/image/img_login_sm.svg"
        alt="로그인이미지(작은 화면)"
        className="block w-[272px] md:hidden"
      />

      <img
        src="/image/img_login_lg.svg"
        alt="로그인이미지(큰 화면)"
        className="hidden w-[451px] md:block lg:w-[533px]"
      />

      <LogInForm onSubmit={handleSubmit} />
    </div>
  );
}
