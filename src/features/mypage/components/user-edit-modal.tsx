"use client";

import { Button } from "@/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/form";
import { FormInput } from "@/shared/components/form-input";
import Image from "next/image";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { EditUserFormValues } from "../schemas/edituser.schema";

function ProfileImageUpload({
  value,
  onChange,
}: {
  value?: File | string;
  onChange: (val: File | string) => void;
}) {
  const [preview, setPreview] = useState<string>(
    typeof value === "string" ? value : value ? URL.createObjectURL(value) : "",
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative mx-auto flex size-[114px] items-center justify-center rounded-full bg-gray-100">
      <Image
        src={preview || "/image/profile.svg"}
        alt="프로필 이미지"
        fill
        className="rounded-full object-cover"
      />
      <label
        htmlFor="profile-upload"
        className="absolute -right-0.5 -bottom-1 flex size-10 cursor-pointer rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
      >
        <Image
          src="/image/ic_edit_lg.svg"
          alt="편집 아이콘"
          fill
          className="rounded-full object-cover"
        />
      </label>
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

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
      <DialogContent className="rounded-3xl px-6 pt-8 pb-6 md:min-w-[616px] md:rounded-[40px] md:px-12 md:pt-12 md:pb-12 lg:pb-11">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold md:text-2xl">
              프로필 수정하기
            </DialogTitle>
            <button type="button" onClick={onClose} className="rounded-full">
              <Image
                src="/image/ic_delete.svg"
                alt="닫기 버튼"
                width={24}
                height={24}
              />
            </button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4 md:gap-8"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <ProfileImageUpload
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormInput
              control={form.control}
              name="name"
              label="이름"
              type="text"
              placeholder="이름을 입력하세요"
              className="gap-1 md:gap-3 md:text-lg"
              disabled
            />

            <FormInput
              control={form.control}
              name="companyName"
              label="회사명"
              type="text"
              placeholder="이름을 입력하세요"
              className="gap-1 md:gap-3 md:text-lg"
            />

            <FormInput
              control={form.control}
              name="email"
              label="이메일"
              type="text"
              placeholder="이름을 입력하세요"
              className="gap-1 md:gap-3 md:text-lg"
              disabled
            />
            <div className="mt-4 flex h-12 w-full gap-3 md:mt-3 md:h-15 md:gap-4 lg:gap-3">
              <Button
                className="h-full flex-1 rounded-2xl border border-[#dddddd] bg-white text-base font-medium text-gray-600 md:rounded-[20px] md:text-xl"
                onClick={onClose}
                type="button"
              >
                취소
              </Button>
              <Button
                className="h-full flex-1 rounded-2xl bg-green-500 text-base font-semibold text-white md:rounded-[20px] md:text-xl md:font-bold"
                type="submit"
                disabled={
                  isLoading ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                {isLoading ? "저장 중..." : "수정하기"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
