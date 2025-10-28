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
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      companyName: "",
    },
  });
  const handleSubmit = (values: {
    email: string;
    password: string;
    name: string;
    companyName: string;
  }) => {
    signup.mutate(values, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
        console.error(error.message);
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
