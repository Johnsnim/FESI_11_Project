"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/dialog";
import { Input } from "@/shadcn/input";
import { Button } from "@/shadcn/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/form";
import { UseFormReturn } from "react-hook-form";
import { EditUserFormValues } from "../schemas/edituser.schema";

export default function UserEditModal({
  open,
  onClose,
  form,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<EditUserFormValues>;
  onSubmit: (data: EditUserFormValues) => void;
  isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원정보 수정</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* 이름 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이름을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이메일을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 회사명 */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사명</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="회사명을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 프로필 이미지 */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로필 이미지</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
