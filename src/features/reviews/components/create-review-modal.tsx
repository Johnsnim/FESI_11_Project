import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { Button } from "@/shadcn/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { CreateReviewFormValues } from "../schemas/review.schema";

interface CreateReviewModalProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<CreateReviewFormValues>;
  onSubmit: (values: CreateReviewFormValues) => void;
  isLoading?: boolean;
}

export default function CreateReviewModal({
  open,
  onClose,
  form,
  onSubmit,
  isLoading = false,
}: CreateReviewModalProps) {
  const {
    formState: { isValid, isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 rounded-3xl px-6 pt-8 pb-6 md:px-12 md:pt-12 md:pb-11">
        <DialogHeader>
          <div className="mb-11 flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold md:text-2xl">
              리뷰 쓰기
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
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {/* 별점 선택 */}
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem className="mb-12 gap-3">
                  <FormLabel className="text-base font-medium">
                    만족스러운 경험이었나요?
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-[1px]">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => field.onChange(score)}
                          className="transition-transform hover:scale-110"
                        >
                          <Heart
                            className={`h-10 w-10 ${
                              field.value >= score
                                ? "fill-green-500 text-green-500"
                                : "fill-[#eeeeee] text-[#eeeeee]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 리뷰 내용 */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="mb-11 gap-2.5">
                  <FormLabel className="text-base font-medium">
                    경험에 대해 남겨주세요.
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
                      className="min-h-50 resize-none rounded-xl bg-[#F9FAFB] px-5 py-4"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-gray-500">
                    <FormMessage />
                    {/* <span>{field.value?.length || 0}/500</span> */}
                  </div>
                </FormItem>
              )}
            />

            {/* 버튼 */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="h-12 flex-1 rounded-2xl border border-[#dddddd] bg-transparent text-base font-medium text-[#737373]"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading || isSubmitting}
                className="h-12 flex-1 rounded-2xl bg-green-500 text-base font-semibold hover:bg-green-600 disabled:bg-gray-50 disabled:text-[#737373]"
              >
                {isLoading ? "제출 중..." : "리뷰 작성"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
