"use client";

import { ReviewsHeader } from "@/features/reviews/components/reviews-header";
import Dallemfit from "@/features/reviews/components/dallemfit";
import Workation from "@/features/reviews/components/workation";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";
import {
  useReviewScoresQuery,
  useInfiniteReviewsQuery,
} from "@/shared/services/review/user-review-queries";
import ReviewScore from "@/features/reviews/components/review-score";
import type { Location, SortBy } from "@/shared/services/review/review.service";
import FiltersBar from "@/shadcn/filters-bar";
import PageTabs, { TabItem } from "@/shared/components/pagetabs";

type DallaemfitFilter = "all" | "OFFICE_STRETCHING" | "MINDFULNESS";

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  // URL에서 필터 상태 읽기
  const currentTab = searchParams.get("tab") ?? "dallemfit";
  const dallaemfitFilter = (searchParams.get("type") ??
    "all") as DallaemfitFilter;
  const selectedLocation = (searchParams.get("location") ?? "all") as
    | Location
    | "all";
  const selectedDate = searchParams.get("date") ?? undefined;
  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as SortBy;

  const { data: scores, isLoading: isScoreLoading } = useReviewScoresQuery();

  // URL 파라미터 업데이트 헬퍼 함수
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`/reviews?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 달램핏 무한 스크롤 쿼리
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
    sortBy: sortBy,
    sortOrder: sortBy === "participantCount" ? "asc" : "desc",
  });

  // 워케이션 무한 스크롤 쿼리
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
    sortBy: sortBy,
    sortOrder: sortBy === "participantCount" ? "asc" : "desc",
  });

  // 현재 탭에 맞는 데이터 선택
  const currentData =
    currentTab === "dallemfit" ? dallaemfitData : workationData;
  const currentIsLoading =
    currentTab === "dallemfit" ? isDallaemfitLoading : isWorkationLoading;
  const currentFetchNextPage =
    currentTab === "dallemfit" ? fetchNextDallaemfit : fetchNextWorkation;
  const currentHasNextPage =
    currentTab === "dallemfit" ? hasNextDallaemfit : hasNextWorkation;
  const currentIsFetchingNextPage =
    currentTab === "dallemfit"
      ? isFetchingNextDallaemfit
      : isFetchingNextWorkation;

  // 모든 페이지의 리뷰를 flat하게 만들기
  const allReviews = currentData?.pages.flatMap((page) => page.data) ?? [];

  // 달램핏 전체 필터링 (클라이언트 사이드)
  const filteredDallaemfitReviews =
    currentTab === "dallemfit" && dallaemfitFilter === "all"
      ? allReviews.filter((review) =>
          ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"].includes(
            review.Gathering.type,
          ),
        )
      : allReviews;

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentHasNextPage &&
          !currentIsFetchingNextPage
        ) {
          currentFetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [currentHasNextPage, currentIsFetchingNextPage, currentFetchNextPage]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    router.push(`/reviews?${params.toString()}`);
  };

  // 필터 변경 핸들러들
  const handleTypeFilterChange = (type: DallaemfitFilter) => {
    updateSearchParams({ type: type === "all" ? null : type });
  };

  const handleLocationChange = (location: Location | "all") => {
    updateSearchParams({ location: location === "all" ? null : location });
  };

  const handleDateChange = (date: string | undefined) => {
    updateSearchParams({ date: date || null });
  };

  const handleSortChange = (sort: SortBy) => {
    updateSearchParams({ sortBy: sort });
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

  return (
    <div className="flex flex-col">
      <ReviewsHeader />

      {/* 탭 컴포넌트 */}
      <div>
        <PageTabs
          layoutId="reviews"
          currentTab={currentTab}
          onChange={handleTabChange}
          tabs={tabs}
          tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
          imageClassName="size-8 md:size-11"
        />
      </div>

      <div className="px-[17px] pt-4 md:px-6 md:pt-6 lg:px-0">
        {/* 필터 바 */}
        <FiltersBar
          showTypeFilter={currentTab === "dallemfit"}
          dallaemfitFilter={dallaemfitFilter}
          setDallaemfitFilter={handleTypeFilterChange}
          selectedLocation={selectedLocation}
          setSelectedLocation={handleLocationChange}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
        />

        <ReviewScore data={scores} isLoading={isScoreLoading} />

        {/* 탭별 내용 렌더링 */}
        <div className="mt-6 mb-8 md:mt-8">
          {currentTab === "dallemfit" && (
            <Dallemfit
              reviews={filteredDallaemfitReviews}
              isLoading={currentIsLoading}
            />
          )}
          {currentTab === "workation" && (
            <Workation reviews={allReviews} isLoading={currentIsLoading} />
          )}

          {/* 무한 스크롤 트리거 */}
          <div
            ref={observerTarget}
            className="flex h-10 items-center justify-center"
          >
            {currentIsFetchingNextPage && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
          </div>
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
