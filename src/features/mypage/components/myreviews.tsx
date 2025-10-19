"use client";

import { ReviewsResponse } from "@/shared/services/review/review.service";
import Image from "next/image";

interface MyReviewsProps {
  data?: ReviewsResponse;
  isLoading: boolean;
}

function ReviewScore({ score }: { score: number }) {
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

export default function MyReviews({ data, isLoading }: MyReviewsProps) {
  if (isLoading) return <div className="p-4">로딩중...</div>;
  console.log("MyReviews data:", data);

  return (
    <ul className="space-y-2.5 rounded-3xl bg-white p-6 md:space-y-10">
      {data?.data?.length ? (
        data.data.map((review) => (
          <li key={review.id} className="flex flex-col gap-6 md:flex-row">
            <div className="relative hidden size-50 overflow-hidden rounded-xl md:block border border-[#ebebeb]">
              <Image src={review.Gathering.image} alt="모임이미지" fill />
            </div>
            <div className=" md:border-b md:border-[#dddddd] w-full">
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
                  <p className="flex gap-2 text-sm font-normal text-[#a4a4a4]">
                    <ReviewScore score={review.score} />
                    {new Date(review.Gathering.dateTime)
                      .toISOString()
                      .slice(0, 10)
                      .replace(/-/g, ".")}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-1.5 pl-1 text-sm font-medium text-[#a4a4a4] md:mb-3">
                <div className="h-[13px] w-[3px] bg-[#dddddd]" />
                <p>{review.Gathering.type} 이용</p> ·
                <p>{review.Gathering.location}</p>
              </div>

              <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-6 md:border-none">
                <div className="relative size-20 overflow-hidden rounded-xl md:hidden">
                  <Image src={review.Gathering.image} alt="모임이미지" fill />
                </div>

                <p className="py-2.5 text-sm font-medium md:py-0">
                  {review.comment}
                </p>
              </div>
            </div>
          </li>
        ))
      ) : (
        <div className="py-8 text-center text-gray-500">
          작성한 리뷰가 없습니다.
        </div>
      )}
    </ul>
  );
}
