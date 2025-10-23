"use client";

import MyPageTabs, { TabItem } from "@/features/mypage/components/mypage-tabs";
import { ReviewsHeader } from "@/features/reviews/components/reviews-header";
import Dallemfit from "@/features/reviews/components/dallemfit";
import Workation from "@/features/reviews/components/workation";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  useReviewScoresQuery,
  useReviewsQuery,
} from "@/shared/services/review/user-review-queries";
import ReviewScore from "@/features/reviews/components/review-score";

type DallaemfitFilter = "all" | "OFFICE_STRETCHING" | "MINDFULNESS";

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "dallemfit";
  const { data: scores, isLoading: isScoreLoading } = useReviewScoresQuery();

  // 달램핏 필터 상태
  const [dallaemfitFilter, setDallaemfitFilter] =
    useState<DallaemfitFilter>("all");

  // 달램핏 리뷰 쿼리
  const { data: dallaemfitData, isLoading: isDallaemfitLoading } =
    useReviewsQuery({
      type: dallaemfitFilter === "all" ? undefined : dallaemfitFilter,
      limit: 20,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  // 워케이션 리뷰 쿼리
  const { data: workationData, isLoading: isWorkationLoading } =
    useReviewsQuery({
      type: "WORKATION",
      limit: 20,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  // 달램핏 전체 필터링 (클라이언트 사이드)
  const filteredDallaemfitReviews =
    dallaemfitFilter === "all"
      ? dallaemfitData?.data.filter((review) =>
          ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"].includes(
            review.Gathering.type,
          ),
        )
      : dallaemfitData?.data;

  const handleTabChange = (tab: string) => {
    router.push(`/reviews?tab=${tab}`);
  };

  const tabs: TabItem[] = [
    {
      value: "dallemfit",
      label: "달램핏",
      imageUrl: "/image/ic_mind_md.svg",
      imageAlt: "달램핏 아이콘",
    },
    {
      value: "workation",
      label: "워케이션",
      imageUrl: "/image/ic_ parasol_md.svg",
      imageAlt: "워케이션 아이콘",
    },
  ];

  const filterOptions = [
    { value: "all" as const, label: "전체" },
    { value: "OFFICE_STRETCHING" as const, label: "오피스 스트레칭" },
    { value: "MINDFULNESS" as const, label: "마인드풀니스" },
  ];

  return (
    <div className="flex flex-col">
      <ReviewsHeader />

      {/* 탭 컴포넌트 */}
      <div>
        <MyPageTabs
          layoutId="reviews"
          currentTab={currentTab}
          onChange={handleTabChange}
          tabs={tabs}
          tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
          imageClassName="size-8 md:size-11"
        />
      </div>
      <div className="px-[17px] pt-4 md:px-6 md:pt-6 lg:px-0">
        {/* 필터 버튼 - 달램핏 탭일 때만 표시 */}
        {currentTab === "dallemfit" && (
          <div className="flex gap-2.5">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDallaemfitFilter(option.value)}
                className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                  dallaemfitFilter === option.value
                    ? "bg-[#4A4A4A] font-semibold text-white"
                    : "bg-slate-200 text-[##333333] hover:bg-[#e5e7eb]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <ReviewScore data={scores} isLoading={isScoreLoading} />

        {/* 탭별 내용 렌더링 */}
        <div className="mt-6 md:mt-8 mb-8">
          {currentTab === "dallemfit" && (
            <Dallemfit
              reviews={filteredDallaemfitReviews || []}
              isLoading={isDallaemfitLoading}
            />
          )}
          {currentTab === "workation" && (
            <Workation
              reviews={workationData?.data || []}
              isLoading={isWorkationLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩중...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
