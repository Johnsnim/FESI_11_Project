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

const KO_EN_MAP: Record<string, string> = {
  ㅂ: "q",
  ㅃ: "Q",
  ㅈ: "w",
  ㅉ: "W",
  ㄷ: "e",
  ㄸ: "E",
  ㄱ: "r",
  ㄲ: "R",
  ㅅ: "t",
  ㅆ: "T",
  ㅛ: "y",
  ㅕ: "u",
  ㅑ: "i",
  ㅐ: "o",
  ㅒ: "O",
  ㅔ: "p",
  ㅖ: "P",
  ㅁ: "a",
  ㄴ: "s",
  ㅇ: "d",
  ㄹ: "f",
  ㅎ: "g",
  ㅗ: "h",
  ㅓ: "j",
  ㅏ: "k",
  ㅣ: "l",
  ㅋ: "z",
  ㅌ: "x",
  ㅊ: "c",
  ㅍ: "v",
  ㅠ: "b",
  ㅜ: "n",
  ㅡ: "m",
};

// 완성형 → 자모 분해
function decomposeHangul(ch: string): string[] {
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return [ch];

  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const JUNG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const JONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const S = code - 0xac00;
  const jong = S % 28;
  const jung = ((S - jong) / 28) % 21;
  const cho = Math.floor(S / 28 / 21);
  return [CHO[cho], JUNG[jung], ...(JONG[jong] ? [JONG[jong]] : [])];
}

// 한글 전체 → 영문 키로 변환
function koToEn(input: string) {
  let result = "";
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    if (KO_EN_MAP[ch]) result += KO_EN_MAP[ch];
    else if (code >= 0xac00 && code <= 0xd7a3)
      result += decomposeHangul(ch)
        .map((j) => KO_EN_MAP[j] || "")
        .join("");
    else result += ch;
  }
  return result;
}

export function InputPassword({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const converted = koToEn(el.value);
    if (converted !== el.value) {
      el.value = converted; // 즉시 한글 → 영어
      const ev = new Event("input", { bubbles: true });
      el.dispatchEvent(ev);
      return;
    }
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력하세요"
        className="h-10 border-none bg-[#f9faf8] pr-10 focus-visible:ring-green-300 focus-visible:outline-none md:h-12"
        onChange={handleChange}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="current-password"
        inputMode="text"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? (
          <img
            src="/image/ic_visibility_on_lg.svg"
            alt="비밀번호 보기"
            className="size-4.5 md:size-6"
          />
        ) : (
          <img
            src="/image/ic_visibility_off_lg.svg"
            alt="비밀번호 숨김"
            className="size-4.5 md:size-6"
          />
        )}
      </button>
    </div>
  );
}
