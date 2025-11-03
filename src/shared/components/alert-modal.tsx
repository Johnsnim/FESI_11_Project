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
        
      <DialogContent className="px-10 pt-12 pb-10 max-w-[600px] rounded-[40px]">
        {/* X 버튼 */}
        <button
          onClick={closeAlert}
          className="absolute top-10 right-10 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>

        {/* 메시지만 표시 */}
        <div className="mb-16 pt-12 text-center">
          <p className="text-2xl font-semibold whitespace-pre-line text-gray-900">
            {message}
          </p>
        </div>

        {/* 버튼들 */}
        <DialogFooter className="flex-row gap-3 sm:flex-row sm:justify-center sm:gap-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              type="button"
              onClick={() => {
                button.onClick();
                closeAlert();
              }}
              className={`h-14 flex-1 rounded-xl text-lg font-semibold transition-colors ${
                button.variant === "outline"
                  ? "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  : "bg-[#00C896] text-white shadow-none hover:bg-[#00B386]"
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
