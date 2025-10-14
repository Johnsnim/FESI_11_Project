import React, { useMemo } from "react";
import { Tag } from "@/shared/components/tag";
import { Chip } from "@/shared/components/chip";

import Image from "next/image";
import type { GatheringDetail } from "../../../app/(public)/detail/[id]/types";

export default function GatheringInfo({ data }: { data: GatheringDetail }) {
  const { dateLabel, timeLabel, tagText, joinDisabled } = useMemo(() => {
    const start = new Date(data.dateTime);
    const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
    const timeLabel = start
      .toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/^0/, "");

    const regEnd = data.registrationEnd ? new Date(data.registrationEnd) : null;
    const isToday =
      regEnd && new Date().toDateString() === new Date(regEnd).toDateString();

    const regEndTime = regEnd
      ? regEnd
          .toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(/^0/, "")
      : null;

    const tagText = regEndTime
      ? `${isToday ? "오늘 " : ""}${regEndTime} 마감`
      : "마감일 미정";

    const joinDisabled =
      !!data.canceledAt ||
      (data.registrationEnd
        ? new Date(data.registrationEnd).getTime() < Date.now()
        : false);

    return { dateLabel, timeLabel, tagText, joinDisabled };
  }, [data]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tag variant="md" icon="/image/ic_alarm.svg">
          {tagText}
        </Tag>
        <Chip variant="infomd">{dateLabel}</Chip>
        <Chip variant="infomd">{timeLabel}</Chip>
      </div>

      <h1 className="mb-4 text-xl leading-tight font-bold md:text-2xl">
        {data.name}
      </h1>

      <p className="text-md mt-1.5 mb-4 leading-7 font-medium tracking-[-0.03em] text-gray-400">
        위치 <span className="pl-2 text-gray-500">{data.location}</span>
      </p>

      <div className="flex items-center gap-1">
        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100">
          <img
            src="/image/ic_heart_empty.svg"
            alt="heart button"
            className="h-6 w-6"
          />
        </div>

        <button
          disabled={joinDisabled}
          className={`ml-auto inline-flex h-10 w-66 items-center justify-center rounded-xl px-5 text-white ${
            joinDisabled
              ? "cursor-not-allowed bg-zinc-300"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          참여하기
        </button>
      </div>
    </div>
  );
}
