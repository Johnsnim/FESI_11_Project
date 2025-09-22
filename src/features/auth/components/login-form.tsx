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
import { Input } from "@/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogInSchema } from "../schemas/auth.schema";

type LoginFormValues = z.infer<typeof LogInSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
}

export default function LogInForm({ onSubmit }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-[40px] bg-white px-4 pt-6 pb-8"
      >
        <p className="mb-6 text-center text-base font-semibold">로그인</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4 gap-1">
              <FormLabel className="text-base font-medium">이메일</FormLabel>
              <FormControl>
                <Input placeholder="이메일을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-8 gap-1">
              <FormLabel className="text-base font-medium">비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mb-4 h-14 w-full bg-gray-50 px-7.5 py-4 text-xl font-semibold text-slate-500"
        >
          로그인
        </Button>
        <p className="text-center text-sm font-medium">
          같이 달램이 처음이신가요?
          <span className="ml-1 font-semibold text-green-600">회원가입</span>
        </p>
      </form>
    </Form>
  );
}
