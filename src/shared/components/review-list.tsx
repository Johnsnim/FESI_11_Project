import {
  GatheringType,
  Review as ReviewType,
} from "@/shared/services/review/review.service";
import Image from "next/image";
import RatingHearts from "./rating-hearts";

interface ReviewsProps {
  reviews: ReviewType[];
  isLoading: boolean;
  variant?: "default" | "detail";
}

const typeLabels: Record<GatheringType, string> = {
  DALLAEMFIT: "달램핏",
  OFFICE_STRETCHING: "오피스 스트레칭",
  MINDFULNESS: "마인드풀니스",
  WORKATION: "워케이션",
};

export default function ReviewList({
  reviews,
  isLoading,
  variant = "default",
}: ReviewsProps) {
  const isDetailVariant = variant === "detail";

  if (isLoading)
    return (
      <div className="my-[180px] flex w-full flex-col items-center justify-center gap-0.5 md:my-[216px]">
        잠시만기다려주세요
      </div>
    );

  if (!reviews || reviews.length === 0)
    return (
      <div className="my-[180px] flex w-full flex-col items-center justify-center gap-0.5 md:my-[216px]">
        <Image
          src={"/image/img_empty.svg"}
          alt="empty_image"
          width={171}
          height={136}
          quality={50}
          loading="lazy"
        />
        <p className="text-lg font-semibold text-[#a4a4a4]">
          아직 작성한 리뷰가 없어요.
        </p>
      </div>
    );

  // detail variant용 렌더링
  if (isDetailVariant) {
    return (
      <ul className="mt-6 space-y-2.5 rounded-3xl bg-white p-6 md:mt-8 md:space-y-10">
        {reviews.map((review, index) => (
          <li
            key={review.id}
            className={`pb-6 ${
              index !== reviews.length - 1 ? "border-b border-[#ebebeb]" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={review.User.image || "/image/profile.svg"}
                  alt="유저이미지"
                  quality={75}
                  fill
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1f1f1f]">
                    {review.User.name}
                  </p>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <RatingHearts score={review.score} />
                  <span className="text-sm text-[#a4a4a4]">
                    {new Date(review.Gathering.dateTime)
                      .toISOString()
                      .slice(0, 10)
                      .replace(/-/g, ".")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#1f1f1f]">
                  {review.comment}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // default variant용 렌더링 (기존 스타일)
  return (
    <ul className="space-y-2.5 rounded-3xl bg-white p-6 md:space-y-10">
      {reviews.map((review) => (
        <li key={review.id} className="flex flex-col gap-6 md:flex-row">
          <div className="relative hidden h-50 w-50 shrink-0 overflow-hidden rounded-xl border border-[#ebebeb] md:block">
            <Image
              src={review.Gathering.image ?? "/image/img_empty.svg"}
              alt="모임이미지"
              fill
              className="object-cover"
              sizes="200px"
              loading="lazy"
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
                  <RatingHearts score={review.score} />
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
                  fetchPriority="high"
                  loading="lazy"
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
