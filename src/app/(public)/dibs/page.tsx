"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import GatheringCategory from "@/shared/components/gatheringcategories";

function getUserId(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export default function DibsPage() {
  const { data: session } = useSession();
  const userId = getUserId((session?.user)?.id);

  const getIds = React.useCallback((): number[] => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("wishlist") || "{}";
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (userId == null) return []; // 비로그인 시 빈 배열
      const arr = parsed[String(userId)];
      if (Array.isArray(arr)) {
        return arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      }
    } catch {}
    return [];
  }, [userId]);

  return (
    <div className="w-full overflow-x-hidden md:px-5 lg:mx-5 lg:mt-10 lg:px-0">
      <div className="flex h-40 w-full flex-row items-center justify-center gap-3 p-4 md:justify-start md:gap-4 lg:mb-2">
        <img
          src="/image/img_head_heart_lg.svg"
          alt="찜하기 배너 이미지"
          className="h-[57px] w-[70px] md:h-[83px] md:w-[102px]"
        />
        <div className="flex flex-col gap-0.5 md:gap-4">
          <p className="text-lg font-semibold text-gray-900 md:text-2xl">
            찜한 모임
          </p>
          <p className="text-base font-medium text-slate-500 md:text-lg">
            마감되기 전에 지금 바로 참여해보세요 👀
          </p>
        </div>
      </div>

      <GatheringCategory mode="dibs" getIds={getIds} />
    </div>
  );
}
