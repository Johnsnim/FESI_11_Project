"use client";

import type { Gathering } from "@/shared/services/gathering/gathering.service";
import Image from "next/image";

interface CreatedGatheringsProps {
  data?: Gathering[];
  isLoading?: boolean;
  gotoDetailPage?: (id: number) => void;
}

export function CreatedGatherings({
  data,
  isLoading,
  gotoDetailPage,
}: CreatedGatheringsProps) {
  if (isLoading) return <div>내가 만든 모임을 불러오는 중...</div>;
  if (!data || data.length === 0)
    return (
      <div className="my-[180px] flex w-full flex-col items-center justify-center gap-0.5 md:my-[216px]">
        <Image
          src={"/image/img_empty.svg"}
          alt="empty_image"
          width={171}
          height={136}
        />
        <p className="text-lg font-semibold text-[#a4a4a4]">
          아직 만든 모임이 없어요.
        </p>
      </div>
    );

  return (
    <ul className="space-y-4">
      {data.map((g) => (
        <li
          key={g.id}
          onClick={() => gotoDetailPage?.(g.id)}
          className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white transition hover:bg-[#ececec] md:flex-row md:items-center md:gap-4 md:p-6"
        >
          <Image
            src={g.image ?? "/image/img_empty.svg"}
            alt={g.name}
            width={100}
            height={100}
            className="h-full max-h-44 w-full border-none md:h-47 md:w-47 md:rounded-3xl md:border md:border-[#ededed]"
          />
          <div className="flex flex-col px-4 pt-4 pb-5.5 md:justify-between md:p-0 md:pt-2 md:pb-2 md:pl-4">
            <p className="mb-3 text-xl font-semibold md:mb-15">{g.name}</p>

            <p className="font-sm mb-1.5 flex items-center gap-1 text-center font-semibold md:mb-2.5">
              <Image
                src={"/image/ic_person.svg"}
                alt="person_image"
                width={16}
                height={16}
              />
              {g.participantCount}/{g.capacity}
            </p>

            <div className="flex items-center text-sm font-medium text-[#A4A4A4]">
              <p className="flex items-center gap-1.5">
                위치 <span className="text-[#737373]">{g.location}</span>
              </p>

              <span className="mx-2.5 h-3 w-px bg-[#cccccc]" />

              <p className="flex items-center gap-1.5">
                날짜
                <span className="text-[#737373]">
                  {new Date(g.dateTime).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>

              <span className="mx-2.5 h-3 w-px bg-[#cccccc]" />

              <p className="flex items-center gap-1.5">
                시간
                <span className="text-[#737373]">
                  {new Date(g.dateTime).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
