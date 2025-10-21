import { Review } from "@/shared/services/review/review.service";
import Image from "next/image";
import { GatheringType } from "@/shared/services/gathering/endpoints";
import { ReviewScore } from "@/features/mypage/components/myreviews";

interface DallemfitProps {
  reviews: Review[];
  isLoading: boolean;
}

const typeLabels: Record<GatheringType, string> = {
  DALLAEMFIT: "달램핏",
  OFFICE_STRETCHING: "오피스 스트레칭",
  MINDFULNESS: "마인드풀니스",
  WORKATION: "워케이션",
};

export default function Dallemfit({
  reviews,
  isLoading,
}: DallemfitProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl bg-white p-6">
        <p className="text-gray-500">로딩중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 리스트 */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12">
          <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-2.5 rounded-3xl bg-white p-6 md:space-y-10">
          {reviews.map((review) => (
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
      )}
    </div>
  );
}