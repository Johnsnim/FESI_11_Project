"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shadcn/dialog";
import { cn } from "@/shadcn/lib/utils";

type ModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  contentClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function ModalShell({
  open,
  onOpenChange,
  title,
  subtitle,
  contentClassName,
  children,
  footer,
}: ModalShellProps) {
  const hasHeader = Boolean(title || subtitle);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("gap-0 rounded-3xl p-0 pt-3", contentClassName)}
      >
        <div className="flex h-full w-full flex-col">
          {hasHeader ? (
            <div className="mb-6 flex items-start justify-between px-6 pt-4 md:px-8 md:pt-6">
              <div className="flex items-baseline gap-2">
                <DialogTitle className="text-base font-semibold md:text-2xl">
                  {title ?? "Dialog"}
                </DialogTitle>
                {subtitle && (
                  <DialogDescription className="text-sm font-medium text-gray-400">
                    {subtitle}
                  </DialogDescription>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="close"
                className="grid size-6 cursor-pointer place-items-center"
              >
                <img src="/image/ic_delete.svg" alt="close" />
              </button>
            </div>
          ) : (
            <DialogTitle className="sr-only">더미</DialogTitle>
          )}

          <div className="min-h-0 flex-1 overflow-auto px-6 pt-4 md:px-8 md:pt-6">
            {children}
          </div>

          {footer && (
            <div className="px-6 pt-4 pb-6 md:px-8 md:pb-8">{footer}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
