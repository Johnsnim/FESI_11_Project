"use client";

import * as React from "react";
import { DialogTitle, DialogClose } from "@/shadcn/dialog";
import { cn } from "@/shadcn/lib/utils";

type HeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
};

export function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <div className="flex items-baseline gap-2">
        <DialogTitle className="text-lg font-semibold tracking-[-0.02em]">
          {title}
        </DialogTitle>
        {subtitle ? (
          <span className="text-sm text-gray-400">{subtitle}</span>
        ) : null}
      </div>

      <DialogClose asChild>
        <button
          type="button"
          aria-label="닫기"
          className="rounded-full p-1 hover:bg-zinc-100"
        >
          <img src="/image/ic_delete.svg" alt="" className="h-5 w-5" />
        </button>
      </DialogClose>
    </div>
  );
}
