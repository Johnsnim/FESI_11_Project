"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";
import { CreateGatheringForm } from "@/shared/components/modals/create/types";
import { LOCATIONS } from "../main/components/category/constants";
import Image from "next/image";

export default function StepDescription({
  data,
  onChange,
}: {
  data: CreateGatheringForm;
  onChange: (d: CreateGatheringForm) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const prevUrlRef = React.useRef<string | null>(null);

  function patch(partial: Partial<CreateGatheringForm>) {
    onChange({ ...data, ...partial });
  }

  function setField<K extends keyof CreateGatheringForm>(
    key: K,
    value: CreateGatheringForm[K],
  ) {
    patch({ [key]: value } as Pick<CreateGatheringForm, K>);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;

    if (fileRef.current) fileRef.current.value = "";

    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }

    if (!f) {
      patch({ imageFile: null, imagePreviewUrl: null });
      return;
    }

    if (f.type && !f.type.startsWith("image/")) {
      console.warn("이미지 파일만 업로드할 수 있습니다.");
      patch({ imageFile: null, imagePreviewUrl: null });
      return;
    }

    const url = URL.createObjectURL(f);
    prevUrlRef.current = url;

    patch({ imageFile: f, imagePreviewUrl: url });
  }

  React.useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-sm font-medium">모임 이름</div>
        <input
          className="w-full rounded-lg bg-[#F9FAFB] px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          placeholder="모임 이름을 작성해주세요"
          value={data.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">장소</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-lg bg-[#F9FAFB] px-3 py-2 text-left text-sm text-gray-500">
              {data.location || "장소를 선택해주세요"}
              <Image
                src="/image/ic_arrow_dropdown_down.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg p-1.5">
            {LOCATIONS.map((label) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => setField("location", label)}
                data-selected={data.location === label}
                className="rounded-md data-[highlighted]:bg-gray-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">이미지</div>

        <div className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg bg-[#F9FAFB] p-1 text-sm font-medium">
          <div className="min-w-0 overflow-hidden">
            {!data.imagePreviewUrl ? (
              <div className="ml-2 truncate text-gray-400">
                이미지를 첨부해주세요
              </div>
            ) : (
              <Image
                src={data.imagePreviewUrl}
                alt="미리보기"
                width={48}
                height={48}
                unoptimized
                className="h-12 max-w-full rounded object-contain ring-1 ring-zinc-200"
              />
            )}
          </div>

          <div className="flex shrink-0 items-center">
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
              className="m-0.5 w-[92px] shrink-0 rounded-md border border-emerald-500 bg-white px-2.5 py-1.5 text-sm font-semibold text-green-600 hover:bg-emerald-50"
            >
              파일 찾기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
