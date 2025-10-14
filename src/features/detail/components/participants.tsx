import React from "react";

import Image from "next/image";
import type { GatheringDetail } from "../../../app/(public)/detail/[id]/types";

export default function Participants({ data }: { data: GatheringDetail }) {
  const ratioPct =
    data.capacity > 0
      ? Math.round((data.participantCount / data.capacity) * 100)
      : 0;

  const avatars = Array.from({
    length: Math.min(data.participantCount, 3),
  }).map((_, i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${i + 1}`);

  return (
    <div className="mt-5 rounded-xl bg-gradient-to-r from-[#DEF8EA] to-[#e5f9f8] p-5">
      <div className="mb-3 flex items-center justify-between text-sm">
        <p className="font-medium">
          <span className="font-medium text-emerald-700">
            {data.participantCount}
          </span>
          명 참여
        </p>

        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <Image
              key={i}
              src={src}
              width={0}
              height={0}
              unoptimized
              sizes="100vw"
              alt="참여자"
              className="h-7 w-7 rounded-full ring-2 ring-white"
            />
          ))}
          {data.participantCount > 3 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium ring-2 ring-white">
              +{data.participantCount - 3}
            </div>
          )}
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

      <div className="p-0.1 w-full rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0]">
        <div
          className="h-2 rounded-full transition-[width]"
          style={{ width: `${ratioPct}%` }}
        />
      </div>
    </div>
  );
}
