"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/shadcn/dialog";
import { cn } from "@/shadcn/lib/utils";
type ModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  contentClassName?: string;
  children: React.ReactNode;
};
export function ModalShell({
  open,
  onOpenChange,
  title,
  subtitle,
  contentClassName,
  children,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-3xl px-6 py-8 md:p-12",
          contentClassName,
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between">
            <div className="flex items-baseline gap-2">
              {title && (
                <h3 className="text-base font-semibold md:text-lg">{title}</h3>
              )}
              {subtitle && (
                <span className="text-sm font-medium text-gray-400">
                  {subtitle}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="close"
              className="grid size-8 place-items-center rounded-full hover:bg-zinc-100"
            >
              <img src="/image/ic_close.svg" alt="close" className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="mt-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
