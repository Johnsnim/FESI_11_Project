"use client";

import * as React from "react";
import { ModalShell } from "@/shared/components/modals/base";
import type { RatingModalForm } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: RatingModalForm;
  onSubmit: (data: RatingModalForm) => Promise<void> | void;
  submitting?: boolean;
};

export default function RatingModal({
  open,
  onOpenChange,
  defaultValues = { score: 0, comment: "" },
  onSubmit,
  submitting = false,
}: Props) {
  const [form, setForm] = React.useState<RatingModalForm>(defaultValues);

  React.useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);

  const canSubmit = form.score > 0 && form.comment.trim().length > 0;

  async function handleConfirm() {
    if (!canSubmit) return;
    await onSubmit(form);
  }

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="리뷰 쓰기"
      contentClassName="w-85.5 rounded-3xl px-6 py-8 md:w-[560px] md:p-10"
    >
      <div className="space-y-5">
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-800">
            만족스러운 경험이었나요?
          </div>
          <HeartRating
            value={form.score}
            onChange={(v) => setForm((f) => ({ ...f, score: v }))}
          />
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-gray-800">
            경험에 대해 남겨주세요.
          </div>
          <textarea
            value={form.comment}
            onChange={(e) =>
              setForm((f) => ({ ...f, comment: e.target.value }))
            }
            placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
            className="h-50 w-full resize-none rounded-lg bg-gray-50 p-4 text-base font-medium text-slate-700 outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="box-border h-12 flex-1 cursor-pointer rounded-2xl border-2 border-slate-100 text-xl font-medium text-gray-600 hover:bg-[#E9EEF5]"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleConfirm}
            className={[
              "h-12 flex-1 cursor-pointer rounded-2xl text-xl font-semibold tracking-[-0.03em] hover:bg-emerald-600",
              canSubmit
                ? "bg-green-500 hover:bg-emerald-600"
                : "bg-slate-50 text-slate-500",
            ].join(" ")}
          >
            리뷰 등록
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function HeartRating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const hearts = Array.from({ length: Math.min(max, 5) }, (_, i) => i + 1);

  return (
    <div
      className="flex items-center gap-0"
      role="radiogroup"
      aria-label="평점 선택"
    >
      {hearts.map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(n)}
            className="grid place-items-center"
          >
            <img
              src={
                active
                  ? "/image/ic_heart_fill.svg"
                  : "/image/ic_heart_empty.svg"
              }
              alt=""
              className="h-[33.5px] w-[29.13px]"
            />
          </button>
        );
      })}
    </div>
  );
}
