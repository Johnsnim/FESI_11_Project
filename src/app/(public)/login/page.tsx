"use client";

import LogInForm from "@/features/login/components/login-form";
import {
  LogInFormValues,
  LogInSchema,
} from "@/features/login/schemas/auth.schema";
import AuthBanner from "@/shared/components/ auth-banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<LogInFormValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });
  async function handleSubmit(values: { email: string; password: string }) {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error === "USER_NOT_FOUND") {
      form.setError("email", {
        type: "manual",
        message: "존재하지 않는 아이디입니다.",
      });
    } else if (res?.error === "INVALID_PASSWORD") {
      form.setError("password", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
    } else if (res?.error) {
      alert("로그인 실패: " + res.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center gap-8 px-4 pt-8 pb-8 md:gap-12 md:px-22 md:pt-10 lg:flex-row lg:items-center">
      <AuthBanner />

      <LogInForm form={form} onSubmit={handleSubmit} />
    </div>
  );
}
