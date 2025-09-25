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
import { UseFormReturn } from "react-hook-form";
import { SignUpFormValues } from "../schemas/signup.schema"; // zod schema에서 가져오기

interface SignUpFormProps {
  form: UseFormReturn<SignUpFormValues>;
  onSubmit: (values: SignUpFormValues) => void;
}

export default function SignUpForm({ form, onSubmit }: SignUpFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-[40px] bg-white px-4 pt-6 pb-8 md:px-14 md:pt-11 md:pb-11 lg:pt-12"
      >
        <p className="text-center font-semibold sm:mb-6 sm:text-base md:pb-13 md:text-2xl">
          회원가입
        </p>

        {/* 이메일 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <InputEmail {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 비밀번호 */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 비밀번호 확인 */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <InputPassword {...field} placeholder="비밀번호를 다시 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
          회원가입
        </Button>
      </form>
    </Form>
  );
}
