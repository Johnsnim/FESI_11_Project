"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/dialog";
import { Button } from "@/shadcn/button";
import { Input } from "@/shadcn/input";
import { useState } from "react";
import { useUpdateUserMutation } from "@/shared/services/auth/use-auth-queries";

export default function UserEditModal() {
  const [companyName, setCompanyName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const updateUser = useUpdateUserMutation();

  const handleSubmit = () => {
    updateUser.mutate(
      { companyName, image: image ?? undefined },
      {
        onSuccess: () => alert("수정 완료!"),
        onError: (e: any) => alert("에러: " + e.message),
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">회원정보 수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원정보 수정</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="회사명"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          <Button onClick={handleSubmit}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
