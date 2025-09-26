"use client";

import { Button } from "@/shadcn/button";
import { Form } from "@/shadcn/form";
import { FormInput } from "@/shared/components/form-input";
import { InputEmail, InputPassword } from "@/shared/components/input-auth";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../schemas/signup.schema";
import Link from "next/link";

interface SignUpFormProps {
  form: UseFormReturn<SignUpFormValues>;
  onSubmit: (values: SignUpFormValues) => void;
}

export default function SignUpForm({ form, onSubmit }: SignUpFormProps) {
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-[40px] bg-white px-14 py-11 shadow-md"
      >
        <h1 className="mb-13 text-center text-2xl font-semibold">회원가입</h1>

        <FormInput
          control={form.control}
          name="name"
          label="이름"
          type="text"
          placeholder="이름을 입력하세요"
          className="mb-6 gap-1"
          inputClassName="h-10 border-none bg-[#f9faf8] focus-visible:ring-green-300 focus-visible:outline-none md:h-12"
        />

        {/* 이메일 */}
        <FormInput
          control={form.control}
          name="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          className="mb-6 gap-1"
          as={InputEmail}
        />

        {/* 회사명 */}
        <FormInput
          control={form.control}
          name="companyName"
          label="회사명"
          type="text"
          className="mb-6 gap-1"
          inputClassName="h-10 border-none bg-[#f9faf8] focus-visible:ring-green-300 focus-visible:outline-none md:h-12"
          placeholder="회사명을 입력하세요"
        />

        {/* 비밀번호 */}
        <FormInput
          control={form.control}
          name="password"
          label="비밀번호"
          className="mb-6 gap-1"
          as={InputPassword}
        />

        {/* 비밀번호ㄴ 확인 */}
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          as={InputPassword}
        />
        {confirmPassword && password === confirmPassword && (
          <p className="mt-1 text-sm text-green-600">비밀번호가 일치합니다</p>
        )}

        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className={`mt-10 mb-4 h-12 w-full rounded-xl text-lg font-semibold md:h-14 ${
            form.formState.isValid
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          회원가입
        </Button>
        <p className="text-center text-sm font-medium">
          이미 회원이신가요?
          <Link
            href={"/login"}
            className="ml-1 font-semibold text-green-600 underline"
          >
            로그인
          </Link>
        </p>
      </form>
    </Form>
  );
}
