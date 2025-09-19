"use client";

import { useState } from "react";
import { useLoginMutation } from "@/shared/services/auth/use-auth-queries";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          alert("로그인됨~");
          router.push("/");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">로그인</button>
    </form>
  );
}
