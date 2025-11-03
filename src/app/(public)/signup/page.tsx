"use client";

import SignUpForm from "@/features/signup/components/signup-form";
import {
  SignUpFormValues,
  SignUpSchema,
} from "@/features/signup/schemas/signup.schema";
import AuthBanner from "@/shared/components/ auth-banner";
import { useSignUpMutation } from "@/shared/services/auth/use-auth-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const router = useRouter();
  const signup = useSignUpMutation();

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
  // confirmPassword를 제외하고 전송
  const { confirmPassword, ...signupData } = values;
  
  signup.mutate(signupData, {
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.log("에러 발생:", error);
      
      // EMAIL_EXISTS 에러 처리
      if (error.code === "EMAIL_EXISTS") {
        form.setError("email", {
          type: "manual",
          message: "이미 사용 중인 이메일입니다",
        });
        return;
      }
      
      // VALIDATION_ERROR 처리
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
      
      // 400 에러 일반 처리
      if (error.status === 400) {
        form.setError("email", {
          type: "manual",
          message: error.message || "이미 사용 중인 이메일입니다",
        });
        return;
      }
      
      // 기타 에러
      console.error("회원가입 실패:", error.message);
    },
  });
};
  return (
    <div className="flex  flex-col items-center justify-center gap-8 px-4 pt-8 pb-8 md:gap-12 md:px-22 md:pt-10 lg:flex-row lg:items-center">
      <AuthBanner />
      <SignUpForm form={form} onSubmit={handleSubmit} />
    </div>
  );
}
