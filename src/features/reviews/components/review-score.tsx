import { ReviewScoreResponse } from "@/shared/services/review/review.service";
import { Heart } from "lucide-react";
import { m } from "motion/react";

interface ReviewScoreProps {
  data?: ReviewScoreResponse[];
  isLoading?: boolean;
}

export default function ReviewsScore({ data, isLoading }: ReviewScoreProps) {
  if (isLoading) return <div>로딩중...</div>;
  if (!data || data.length === 0)
    return <div>아직 평가된 모임이 없습니다.</div>;

  const score = data[0];
  const average = score.averageScore ?? 0;
  const totalPeople =
    score.fiveStars +
    score.fourStars +
    score.threeStars +
    score.twoStars +
    score.oneStar;

  // 꽉 찬 하트 개수
  const fullHearts = Math.floor(average);
  // 소수점 부분 (예: 3.4 → 0.4)
  const partial = average - fullHearts;

  // 각 점수별 데이터
  const scoreData = [
    { label: "5점", count: score.fiveStars, color: "#10B981" },
    { label: "4점", count: score.fourStars, color: "#10B981" },
    { label: "3점", count: score.threeStars, color: "#10B981" },
    { label: "2점", count: score.twoStars, color: "#10B981" },
    { label: "1점", count: score.oneStar, color: "#10B981" },
  ];

  return (
    <div className="mt-4 flex flex-col items-center rounded-3xl border border-[#AFEFD1] bg-gradient-to-r from-[#DEF8EA] to-[#DEF8EA] px-6 py-8 md:mt-8 md:flex-row md:items-center md:justify-center md:gap-12 md:px-12 md:py-11">
      {/* 왼쪽: 점수 & 하트 */}
      <div className="flex flex-col items-center md:gap-3">
        <h1 className="flex items-baseline gap-[5.5px] text-[28px] font-bold text-[#111827] md:text-[40px]">
          {average.toFixed(1)}
          <span className="text-sm font-normal text-[#737373] md:text-base">
            (총 {totalPeople}명 참여)
          </span>
        </h1>

        {/* 하트 평점 */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            if (i < fullHearts) {
              // 완전 채워진 하트
              return (
                <Heart
                  key={i}
                  size={32}
                  className="fill-[#10B981] text-[#10B981] md:h-10 md:w-10"
                />
              );
            } else if (i === fullHearts && partial > 0) {
              // 부분 채워진 하트
              return (
                <div key={i} className="relative">
                  <Heart
                    size={32}
                    className="fill-[#DAE3E3] text-[#DAE3E3] md:h-10 md:w-10"
                  />
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{
                      width: `${partial * 100}%`,
                      height: "100%",
                    }}
                  >
                    <Heart
                      size={32}
                      className="fill-[#10B981] text-[#10B981] md:h-10 md:w-10"
                    />
                  </div>
                </div>
              );
            } else {
              // 비어있는 하트
              return (
                <Heart
                  key={i}
                  size={32}
                  className="fill-[#DAE3E3] text-[#DAE3E3] md:h-10 md:w-10"
                />
              );
            }
          })}
        </div>
      </div>

      {/* 가운데 구분선 (md 이상에서만 표시) */}
      <div className="hidden h-[180px] w-px bg-[#CCE5DA] md:block" />

      {/* 오른쪽: 프로그레스 바 */}
      <div className="mt-8 w-full space-y-2 md:mt-0 md:max-w-[330px] md:flex-1">
        {scoreData.map((item, index) => {
          const percentage =
            totalPeople > 0 ? (item.count / totalPeople) * 100 : 0;

          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-end text-sm font-semibold text-[#10B981] md:text-base">
                {item.label}
              </span>

              {/* 프로그레스 바 */}
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#E5E7EB]">
                <m.div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#5DD996] to-[#68E3E3]"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                />
              </div>

              <span className="text-sm font-medium text-[#737373] md:text-base">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
