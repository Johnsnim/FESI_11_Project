"use client";

import LogInForm from "@/features/auth/components/login-form";
import {
  LogInFormValues,
  LogInSchema,
} from "@/features/auth/schemas/auth.schema";
import { useLoginMutation } from "@/shared/services/auth/use-auth-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const router = useRouter();
  const login = useLoginMutation();

  const form = useForm<LogInFormValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const handleSubmit = (values: LogInFormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        if (error.status === 404) {
          form.setError("email", {
            type: "server",
            message: "존재하지 않는 아이디입니다.",
          });
        }

        if (error.status === 401) {
          form.setError("password", {
            type: "server",
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
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
      ㄴ
      <LogInForm form={form} onSubmit={handleSubmit} />
    </div>
  );
}
