// @/shared/components/alert-modal.tsx
"use client";

import { Dialog, DialogContent, DialogFooter } from "@/shadcn/dialog";
import { Button } from "@/shadcn/button";
import { useAlertStore } from "@/shared/store/alert-store";
import { X } from "lucide-react";

export function AlertModal() {
  const { open, message, buttons, closeAlert } = useAlertStore();

  return (
    <Dialog open={open} onOpenChange={closeAlert}>
      <DialogContent className="max-w-[342px] rounded-[40px] p-6 md:px-10 md:pt-12 md:pb-10 md:max-w-[600px]">
        {/* X 버튼 */}
        <button
          onClick={closeAlert}
          className="absolute top-10 right-10 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>

        {/* 메시지만 표시 */}
        <div className="mb-11 pt-12 md:mb-16 md:pt-12 text-center">
          <p className="text-lg font-semibold whitespace-pre-line text-gray-900 md:text-2xl">
            {message}
          </p>
        </div>

        {/* 버튼들 */}
        <DialogFooter className="flex justify-center gap-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              type="button"
              onClick={() => {
                button.onClick();
                closeAlert();
              }}
              className={`h-14 flex-1 cursor-pointer rounded-[20px] text-base transition-colors md:text-xl ${
                button.variant === "outline"
                  ? "border border-gray-200 bg-white font-medium text-gray-500 hover:bg-gray-50"
                  : "bg-green-500 font-bold text-white shadow-none hover:bg-green-600"
              }`}
            >
              {button.label}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
