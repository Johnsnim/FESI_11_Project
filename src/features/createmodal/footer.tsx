"use client";
import * as React from "react";

type FooterProps = React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  maxStep: number;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function Footer({
  step,
  maxStep,
  canNext,
  onPrev,
  onNext,
  onClose,
  onSubmit,
  className,
  ...rest
}: FooterProps) {
  return (
    <div
      className={["mt-6 flex items-center justify-between", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {step === 0 ? (
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-xl border border-zinc-200 px-5 text-sm font-medium text-gray-700 hover:bg-zinc-50"
        >
          취소
        </button>
      ) : (
        <button
          type="button"
          onClick={onPrev}
          className="h-10 rounded-xl border border-zinc-200 px-5 text-sm font-medium text-gray-700 hover:bg-zinc-50"
        >
          이전
        </button>
      )}

      {step < maxStep ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={[
            "h-10 rounded-xl px-6 text-sm font-semibold text-white",
            canNext ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-300",
          ].join(" ")}
        >
          다음
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canNext}
          className={[
            "h-10 rounded-xl px-6 text-sm font-semibold text-white",
            canNext ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-300",
          ].join(" ")}
        >
          모임 만들기
        </button>
      )}
    </div>
  );
}
