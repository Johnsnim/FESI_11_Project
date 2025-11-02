"use client";

import { ReviewsHeader } from "@/features/reviews/components/reviews-header";
import { Suspense, useMemo, memo } from "react";
import {
  useReviewScoresQuery,
  useInfiniteReviewsQuery,
} from "@/shared/services/review/user-review-queries";
import ReviewScore from "@/features/reviews/components/review-score";
import type { SortBy } from "@/shared/services/review/review.service";
import FiltersBar from "@/shared/components/filters-bar";
import PageTabs from "@/shared/components/pagetabs";
import { useUrlFilters } from "@/shared/hooks/use-url-filters";
import { useTabFilters } from "@/shared/hooks/use-tab-filters";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { LoaderCircle } from "lucide-react";
import ReviewList from "@/shared/components/review-list";

const TABS = [
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

const SORT_OPTIONS = [
  { value: "createdAt" as SortBy, label: "최신순" },
  { value: "score" as SortBy, label: "별점순" },
  { value: "participantCount" as SortBy, label: "참여인원순" },
];

// 로딩 인디케이터 컴포넌트 분리
const LoadingSpinner = memo(() => (
  <div className="flex h-10 items-center justify-center">
    <LoaderCircle className="mt-6 animate-spin text-gray-400" />
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// 초기 로딩 스켈레톤
const ReviewsSkeleton = memo(() => (
  <div className="space-y-6 p-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="h-24 animate-pulse rounded-lg bg-zinc-200" />
      </div>
    ))}
  </div>
));
ReviewsSkeleton.displayName = "ReviewsSkeleton";

function ReviewsContent() {
  const {
    currentTab,
    dallaemfitFilter,
    selectedLocation,
    selectedDate,
    searchParams,
    updateSearchParams,
  } = useUrlFilters({ basePath: "/reviews" });

  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as SortBy;

  const handlers = useTabFilters<SortBy>(updateSearchParams, currentTab);

  // 리뷰 점수는 항상 필요
  const { data: scores, isLoading: isScoreLoading } = useReviewScoresQuery();

  const isDallaemfitTab = currentTab === "dallemfit";

  const {
    data: dallaemfitData,
    isLoading: isDallaemfitLoading,
    fetchNextPage: fetchNextDallaemfit,
    hasNextPage: hasNextDallaemfit,
    isFetchingNextPage: isFetchingNextDallaemfit,
  } = useInfiniteReviewsQuery({
    type: dallaemfitFilter === "all" ? undefined : dallaemfitFilter,
    location: selectedLocation === "all" ? undefined : selectedLocation,
    date: selectedDate,
    sortBy,
    sortOrder: sortBy === "participantCount" ? "asc" : "desc",
  });

  const {
    data: workationData,
    isLoading: isWorkationLoading,
    fetchNextPage: fetchNextWorkation,
    hasNextPage: hasNextWorkation,
    isFetchingNextPage: isFetchingNextWorkation,
  } = useInfiniteReviewsQuery({
    type: "WORKATION",
    location: selectedLocation === "all" ? undefined : selectedLocation,
    date: selectedDate,
    sortBy,
    sortOrder: sortBy === "participantCount" ? "asc" : "desc",
  });

  // 현재 탭의 데이터 선택 (메모이제이션)
  const {
    currentData,
    currentIsLoading,
    currentFetchNextPage,
    currentHasNextPage,
    currentIsFetchingNextPage,
  } = useMemo(
    () => ({
      currentData: isDallaemfitTab ? dallaemfitData : workationData,
      currentIsLoading: isDallaemfitTab
        ? isDallaemfitLoading
        : isWorkationLoading,
      currentFetchNextPage: isDallaemfitTab
        ? fetchNextDallaemfit
        : fetchNextWorkation,
      currentHasNextPage: isDallaemfitTab
        ? hasNextDallaemfit
        : hasNextWorkation,
      currentIsFetchingNextPage: isDallaemfitTab
        ? isFetchingNextDallaemfit
        : isFetchingNextWorkation,
    }),
    [
      isDallaemfitTab,
      dallaemfitData,
      workationData,
      isDallaemfitLoading,
      isWorkationLoading,
      fetchNextDallaemfit,
      fetchNextWorkation,
      hasNextDallaemfit,
      hasNextWorkation,
      isFetchingNextDallaemfit,
      isFetchingNextWorkation,
    ],
  );

  // 리뷰 데이터 평탄화 (메모이제이션)
  const allReviews = useMemo(
    () => currentData?.pages.flatMap((page) => page.data) ?? [],
    [currentData],
  );

  // 필터링 (달램핏 "all" 필터인 경우만)
  const filteredReviews = useMemo(() => {
    if (isDallaemfitTab && dallaemfitFilter === "all") {
      return allReviews.filter((review) =>
        ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"].includes(
          review.Gathering.type,
        ),
      );
    }
    return allReviews;
  }, [isDallaemfitTab, dallaemfitFilter, allReviews]);

  // 무한 스크롤 observer
  const observerTarget = useInfiniteScroll(
    currentFetchNextPage,
    currentHasNextPage,
    currentIsFetchingNextPage,
  );

  // 표시할 리뷰 선택
  const displayReviews = isDallaemfitTab ? filteredReviews : allReviews;

  return (
    <div className="flex flex-col">
      <ReviewsHeader />

      <div>
        <PageTabs
          layoutId="reviews"
          currentTab={currentTab}
          onChange={handlers.handleTabChange}
          tabs={TABS}
          tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
          imageClassName="size-8 md:size-11"
        />
      </div>

      <div className="px-[17px] pt-4 md:px-6 md:pt-6 lg:px-0">
        <FiltersBar
          showTypeFilter={isDallaemfitTab}
          dallaemfitFilter={dallaemfitFilter}
          setDallaemfitFilter={handlers.handleTypeFilterChange}
          selectedLocation={selectedLocation}
          setSelectedLocation={handlers.handleLocationChange}
          selectedDate={selectedDate}
          setSelectedDate={handlers.handleDateChange}
          sortBy={sortBy}
          setSortBy={handlers.handleSortChange}
          sortOptions={SORT_OPTIONS}
        />

        <ReviewScore data={scores} isLoading={isScoreLoading} />

        <div className="mt-6 mb-8 md:mt-8">
          {currentIsLoading ? (
            <ReviewsSkeleton />
          ) : (
            <>
              <ReviewList reviews={displayReviews} isLoading={false} />

              {/* 무한 스크롤 트리거 */}
              <div ref={observerTarget}>
                {currentIsFetchingNextPage && <LoadingSpinner />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <ReviewsContent />
    </Suspense>
  );
}
