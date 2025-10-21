"use client";

import {
  GatheringType,
  ReviewsResponse,
} from "@/shared/services/review/review.service";
import Image from "next/image";

interface ReviewsProps {
  data?: ReviewsResponse;
  isLoading: boolean;
}
const typeLabels: Record<GatheringType, string> = {
  DALLAEMFIT: "달램핏",
  OFFICE_STRETCHING: "오피스 스트레칭",
  MINDFULNESS: "마인드풀니스",
  WORKATION: "워케이션",
};

export function ReviewScore({ score }: { score: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => {
        const src =
          i < score
            ? "/image/ic_heart_fill.svg" // 채워진 하트
            : "/image/ic_heart.svg"; // 빈 하트
        return (
          <Image
            key={i}
            src={src}
            alt="heart"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        );
      })}
    </div>
  );
}

export default function MyReviews({ data, isLoading }: ReviewsProps) {
  if (isLoading)
    return (
      <div className="my-[180px] flex w-full flex-col items-center justify-center gap-0.5 md:my-[216px]">
        로딩중...
      </div>
    );
  if (!data || data.data.length === 0)
    return (
      <div className="my-[180px] flex w-full flex-col items-center justify-center gap-0.5 md:my-[216px]">
        <Image
          src={"/image/img_empty.svg"}
          alt="empty_image"
          width={171}
          height={136}
        />
        <p className="text-lg font-semibold text-[#a4a4a4]">
          아직 작성한 리뷰가 없어요.
        </p>
      </div>
    );

  return (
    <ul className="space-y-2.5 rounded-3xl bg-white p-6 md:space-y-10">
      {data.data.map((review) => (
        <li key={review.id} className="flex flex-col gap-6 md:flex-row">
          <div className="relative hidden size-50 overflow-hidden rounded-xl border border-[#ebebeb] md:block">
            <Image
              src={review.Gathering.image ?? "/image/img_empty.svg"}
              alt="모임이미지"
              fill
            />
          </div>
          <div className="w-full md:border-b md:border-[#dddddd]">
            <div className="mb-2 flex items-center gap-3 md:mb-8">
              <div className="relative size-10 overflow-hidden rounded-full">
                <Image
                  src={review.User.image || "/image/profile.svg"}
                  alt="유저이미지"
                  fill
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#737373]">
                  {review.User.name}
                </p>
                <div className="flex gap-2 text-sm font-normal text-[#a4a4a4]">
                  <ReviewScore score={review.score} />
                  {new Date(review.Gathering.dateTime)
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, ".")}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-1.5 pl-1 text-sm font-medium text-[#a4a4a4] md:mb-3">
              <div className="h-[13px] w-[3px] bg-[#dddddd]" />
              <p>{typeLabels[review.Gathering.type]} 이용</p> ·
              <p>{review.Gathering.location}</p>
            </div>

            <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-6 md:border-none">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl md:hidden">
                <Image
                  src={review.Gathering.image ?? "/image/img_empty.svg"}
                  alt="모임이미지"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <p className="py-2.5 text-sm font-medium md:py-0">
                {review.comment.length > 120
                  ? `${review.comment.slice(0, 120)}...`
                  : review.comment}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
