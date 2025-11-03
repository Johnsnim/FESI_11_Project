import * as React from "react";
import { DialogTitle, DialogClose } from "@/shadcn/dialog";
import { cn } from "@/shadcn/lib/utils";
import Image from "next/image";

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
          <Image src="/image/ic_delete.svg" alt="" width={20} height={20} />
        </button>
      </DialogClose>
    </div>
  );
}
