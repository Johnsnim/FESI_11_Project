"use client";

import { Input } from "@/shadcn/input";
import { useState } from "react";

export function InputEmail({ ...props }) {
  return (
    <div className="w-full">
      <Input
        {...props}
        type="email"
        placeholder="이메일을 입력하세요"
        className="h-10 border-none bg-[#f9faf8] focus-visible:ring-green-300 focus-visible:outline-none md:h-12"
      />
    </div>
  );
}

export function InputPassword({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력하세요"
        className="h-10 border-none bg-[#f9faf8] focus-visible:ring-green-300 focus-visible:outline-none md:h-12"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? (
          <img
            src="/image/ic_visibility_off_lg.svg"
            alt="비밀번호 숨김"
            className="size-4.5 md:size-6"
          />
        ) : (
          <img
            src="/image/ic_visibility_on_lg.svg"
            alt="비밀번호 보기"
            className="size-4.5 md:size-6"
          />
        )}
      </button>
    </div>
  );
}
