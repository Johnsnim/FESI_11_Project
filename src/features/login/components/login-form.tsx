"use client";

import { Button } from "@/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/form";
import { InputEmail, InputPassword } from "@/shared/components/input-auth";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { LogInFormValues } from "../schemas/auth.schema";
import { FormInput } from "@/shared/components/form-input";

interface LoginFormProps {
  form: UseFormReturn<LogInFormValues>;
  onSubmit: (values: LogInFormValues) => void;
}

export default function LogInForm({ form, onSubmit }: LoginFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-[40px] bg-white px-4 pt-6 pb-8 md:px-14 md:pt-11 md:pb-11 lg:pt-12"
      >
        <p className="text-center font-semibold sm:mb-6 sm:text-base md:pb-13 md:text-2xl">
          로그인
        </p>

        <FormInput
          control={form.control}
          name="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          className="mb-4 gap-1 md:mb-6 md:gap-2"
          as={InputEmail}
        />
        <FormInput
          control={form.control}
          name="password"
          label="비밀번호"
          className="mb-8 gap-1 md:mb-10 md:gap-2"
          as={InputPassword}
        />

        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className={`mb-4 h-14 w-full rounded-2xl px-7.5 py-4 text-xl font-semibold ${
            form.formState.isValid
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-50 text-slate-500"
          }`}
        >
          로그인
        </Button>

        <p className="text-center text-sm font-medium">
          같이 달램이 처음이신가요?
          <Link
            href={"/signup"}
            className="ml-1 font-semibold text-green-600 underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </Form>
  );
}
