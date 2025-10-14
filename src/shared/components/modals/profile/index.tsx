"use client";
import * as React from "react";
import { ModalShell } from "../base";
export type ProfileForm = {
  name: string;
  companyName: string;
  email: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
};
export default function ProfileEditModal({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  submitting = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: ProfileForm;
  onSubmit: (data: ProfileForm) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [form, setForm] = React.useState<ProfileForm>(defaultValues);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);
  function setField<K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setField("imageFile", null);
      setField("imagePreviewUrl", null);
      return;
    }
    const url = URL.createObjectURL(f);
    setField("imageFile", f);
    setField("imagePreviewUrl", url);
  }
  async function handleSave() {
    await onSubmit(form);
  }
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="프로필 수정하기"
      contentClassName="w-85.5 rounded-3xl px-6 py-8 md:w-[520px] md:p-10"
    >
      <div className="mb-6 flex w-full justify-center">
        <div className="relative">
          <div className="grid size-20 place-items-center overflow-hidden rounded-full bg-emerald-50 ring-1 ring-zinc-200">
            {form.imagePreviewUrl ? (
              <img
                src={form.imagePreviewUrl}
                alt="avatar preview"
                className="size-20 object-cover"
              />
            ) : (
              <img
                src="/image/img_profile_default.svg"
                alt="default avatar"
                className="size-12"
              />
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute right-0 -bottom-2 rounded-full border border-emerald-500 bg-white px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50"
          >
            변경
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-sm font-medium">이름</div>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full rounded-lg bg-[#F9FAFB] px-3 py-2 text-sm ring-2 ring-transparent outline-none focus:ring-emerald-200"
            placeholder="이름을 입력해주세요"
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">회사</div>
          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            className="w-full rounded-lg bg-[#F9FAFB] px-3 py-2 text-sm ring-2 ring-transparent outline-none focus:ring-emerald-200"
            placeholder="회사명을 입력해주세요"
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">이메일</div>
          <input
            value={form.email}
            readOnly
            className="w-full cursor-not-allowed rounded-lg bg-[#F9FAFB] px-3 py-2 text-sm text-gray-500"
            placeholder="이메일"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="h-10 rounded-lg bg-[#F1F5F9] px-5 text-sm font-semibold text-gray-600 hover:bg-[#E9EEF5]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="h-10 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {submitting ? "저장 중…" : "수정하기"}
        </button>
      </div>
    </ModalShell>
  );
}
