"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  gatheringService,
  type Gathering,
} from "@/shared/services/gathering/gathering.service";

// 유저 이미지 없을 때 그냥 닉네임 첫글자 이니셜 따서 보여주는 로직
function InitialsBubble({ name }: { name: string }) {
  const text = (name ?? "").trim();
  const initials =
    text.length === 0
      ? "?"
      : text
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-300">
      {initials}
    </div>
  );
}

export default function Participants({ data }: { data: Gathering }) {
  const ratioPct =
    data.capacity > 0
      ? Math.round((data.participantCount / data.capacity) * 100)
      : 0;

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["gathering", "participants", data.id],
    queryFn: () =>
      gatheringService.participants(data.id, {
        limit: 12,
        sortBy: "joinedAt",
        sortOrder: "desc",
      }),
    staleTime: 30_000,
  });

  const visible = participants.slice(0, 4);

  // 보여주는 프로필 이미지 외에 추가 참여자 수 계산
  const extra = Math.max(0, data.participantCount - visible.length);

  return (
    <div className="mt-5 rounded-xl bg-gradient-to-r from-[#DEF8EA] to-[#e5f9f8] p-5">
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="flex flex-row items-center gap-2">
          <p className="font-medium">
            <span className="font-medium text-emerald-700">
              {data.participantCount}
            </span>
            명 참여
          </p>

          <div className="flex -space-x-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 animate-pulse rounded-full bg-zinc-200 ring-2 ring-white"
                />
              ))
            ) : (
              <>
                {visible.map((p) => {
                  const key = `${p.userId}-${p.joinedAt}`;
                  const img = p.User.image;
                  const name = p.User.name || p.User.email || "참여자";
                  return img ? (
                    <Image
                      key={key}
                      src={img}
                      alt={name}
                      width={28}
                      height={28}
                      unoptimized
                      className="h-7 w-7 rounded-full object-cover ring-white"
                    />
                  ) : (
                    <InitialsBubble key={key} name={name} />
                  );
                })}
                {extra > 0 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium ring-2 ring-white">
                    +{extra}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row">
          <img src="/image/ic_check_sm.svg" alt="check" />
          <p className="font-medium text-green-600">개설확정</p>
        </div>
      </div>

      <div className="mt-4 mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>최소 {data.capacity}명</span>
        <span>최대 {data.capacity}명</span>
      </div>

      <div className="p-0.1 w-full rounded-full bg-[#DAE4E0]">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0] transition-[width]"
          style={{ width: `${ratioPct}%` }}
        />
      </div>
    </div>
  );
}
