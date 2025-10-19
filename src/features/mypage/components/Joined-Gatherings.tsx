"use client";

import { Button } from "@/shadcn/button";
import type { JoinedGathering } from "@/shared/services/gathering/gathering.service";
import Image from "next/image";

export interface JoinedGatheringsProps {
  data?: JoinedGathering[];
  isLoading?: boolean;
  onCancel?: (gatheringId: number) => void;
  onWriteReview?: (gatheringId: number) => void;
  gotoDetailPage?: (gatheringId: number) => void;
}

export default function JoinedGatherings({
  data,
  isLoading,
  gotoDetailPage,
  onCancel,
}: JoinedGatheringsProps) {
  if (isLoading) return <div>롸딩중..</div>;
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
          아직 신청한 모임이 없어요.
        </p>
      </div>
    );

  const UsageStatusText = (g: JoinedGathering) => {
    if (g.isCompleted)
      return (
        <div className="h-8 rounded-3xl bg-[#eeeeee] px-3 py-1.5 text-sm font-medium text-[#737373]">
          이용 완료
        </div>
      );
    return (
      <div className="h-8 rounded-3xl bg-green-200 px-3 py-1.5 text-sm font-semibold text-green-600">
        이용예정
      </div>
    );
  };

  const CreationStatusText = (g: JoinedGathering) => {
    const now = Date.now();
    const startAt = new Date(g.dateTime).getTime();
    const regEndAt = new Date(g.registrationEnd).getTime();

    if (now < regEndAt)
      return (
        <div className="h-8 rounded-3xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500">
          개설 대기
        </div>
      );
    if (now >= regEndAt && now < startAt)
      return (
        <div className="gradient-border flex h-8 items-center gap-0.5 rounded-3xl border py-1.5 pr-3 pl-2 text-sm font-medium text-green-600">
          <Image
            src="image/ic_check_md.svg"
            alt="check_img"
            width={18}
            height={18}
          />
          개설 확정
        </div>
      );
    if (g.isCompleted) return null;

    return "";
  };

  const RenderActionButton = (
    g: JoinedGathering,
    onCancel?: (id: number) => void,
    onWriteReview?: (id: number) => void,
  ) => {
    const stopPropagation = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    if (!g.isCompleted) {
      // 이용 전 → 예약취소 버튼
      return (
        <Button
          onClick={(e) => {
            stopPropagation(e); // 카드 클릭 이벤트 막기
            onCancel?.(g.id);
          }}
          className="h-11 cursor-pointer rounded-2xl border border-green-500 bg-white px-6 py-2.5 text-base font-semibold text-[#54C591] hover:bg-green-50 md:h-12 md:px-[17.5px] md:py-3 lg:px-[35.5px]"
        >
          예약 취소하기
        </Button>
      );
    }

    if (g.isCompleted && !g.isReviewed) {
      // 이용 완료 & 리뷰 미작성 → 리뷰작성 버튼
      return (
        <Button
          onClick={() => onWriteReview?.(g.id)}
          className="py-2.5md:h-12 h-12 cursor-pointer rounded-2xl bg-green-500 px-6 text-base font-bold text-white hover:bg-green-600 md:px-[17.5px] md:py-3 lg:px-[35.5px]"
        >
          리뷰 작성하기
        </Button>
      );
    }
    return null;
  };

  return (
    <ul className="space-y-4">
      {data.map((g) => (
        <li
          key={g.id}
          onClick={() => gotoDetailPage?.(g.id)}
          className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white transition hover:bg-[#ececec] md:flex-row md:items-center md:gap-4 md:p-6"
        >
          <Image
            src={g.image}
            alt={g.name}
            width={100}
            height={100}
            className="h-full w-full border-none sm:max-h-44 md:h-47 md:w-47 md:rounded-3xl md:border md:border-[#ededed]"
          />

          <div className="px-4 pt-4 pb-4.5 md:flex-1 md:px-0 md:pt-0 md:pb-0">
            {/* 상태 텍스트 */}
            <div className="mb-3.5 flex gap-2 md:mb-4">
              {UsageStatusText(g)}
              {CreationStatusText(g)}
            </div>

            <p className="mb-3 text-xl font-semibold md:mb-15">{g.name}</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* <Image /> */}
              <div>
                <p className="font-sm mb-1.5 flex items-center gap-1 text-center font-semibold md:mb-2.5">
                  <Image
                    src={"/image/ic_person.svg"}
                    alt="person_image"
                    width={16}
                    height={16}
                  />
                  {g.participantCount}/{g.capacity}
                </p>

                <div className="mb-5.5 flex items-center text-sm font-medium text-[#A4A4A4] md:mb-0">
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
              {/*액션 버튼*/}
              <div className="flex justify-end">
                {RenderActionButton(g, onCancel)}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
