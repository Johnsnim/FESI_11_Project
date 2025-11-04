// signup/page.tsx
"use client";

import SignUpForm from "@/features/signup/components/signup-form";
import {
  SignUpFormValues,
  SignUpSchema,
} from "@/features/signup/schemas/signup.schema";
import { useSignUpMutation } from "@/shared/services/auth/use-auth-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn, signOut } from "next-auth/react"; // 👈 추가
import { confirm, alert } from "@/shared/store/alert-store"; // 👈 추가
import AuthBanner from "@/shared/components/ auth-banner";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const signup = useSignUpMutation();
    const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);


  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      companyName: "",
    },
  });

  const handleSubmit = (values: SignUpFormValues) => {
    const { confirmPassword, ...signupData } = values;
    
     signup.mutate(signupData, {
    onSuccess: () => {
      confirm(
        "회원가입이 완료되었습니다!\n바로 로그인하시겠습니까?",
        async () => {
          setIsAutoLoggingIn(true);
          
          try {
            console.log("🔵 회원가입 성공, 자동 로그인 시작");
            console.log("📧 이메일:", values.email);

            // signOut
            console.log("🚪 기존 세션 제거 중...");
            await signOut({ redirect: false });
            console.log("✅ 세션 제거 완료");

            // 지연
            console.log("⏳ 500ms 대기...");
            await new Promise(resolve => setTimeout(resolve, 500));

            // signIn
            console.log("🔑 로그인 시도 중...");
            const result = await signIn("credentials", {
              email: values.email,
              password: values.password,
              redirect: false,
            });

            console.log("📊 로그인 결과:", result);

            if (result?.error) {
              console.error("❌ 로그인 실패:", result.error);
              alert("로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
              router.push("/login");
            } else if (result?.ok) {
              console.log("✅ 로그인 성공, 메인 페이지로 이동");
              window.location.href = "/";
            }
          } catch (error) {
            console.error("💥 예외 발생:", error);
            alert("로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
            router.push("/login");
          } finally {
            setIsAutoLoggingIn(false);
          }
        },
        () => {
          router.push("/login");
        }
      );
    },
      onError: (error) => {
        console.log("에러 발생:", error);
        
        if (error.code === "EMAIL_EXISTS") {
          form.setError("email", {
            type: "manual",
            message: "이미 사용 중인 이메일입니다",
          });
          return;
        }
        
        if (error.code === "VALIDATION_ERROR") {
          const field = error.parameter as keyof SignUpFormValues;
          if (field && form.getValues(field) !== undefined) {
            form.setError(field, {
              type: "manual",
              message: error.message || "입력값을 확인해주세요",
            });
          }
          return;
        }
        
        if (error.status === 400) {
          form.setError("email", {
            type: "manual",
            message: error.message || "이미 사용 중인 이메일입니다",
          });
          return;
        }
        
        console.error("회원가입 실패:", error.message);
      },
    });
  };

  return (
   <div className="flex flex-col items-center justify-center gap-8 px-4 pt-8 pb-8 md:gap-12 md:px-22 md:pt-10 lg:flex-row lg:items-start lg:gap-16">
      {/*                                                                                    👆 items-center → items-start */}
      <div className="flex-shrink-0 lg:mt-20">
        <AuthBanner />
      </div>
      <div className="w-full max-w-[640px]">
        <SignUpForm form={form} onSubmit={handleSubmit} />
      </div>
    </div>

  );
}