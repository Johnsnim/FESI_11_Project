"use client";

import { ReviewsHeader } from "@/features/reviews/components/reviews-header";
import { Suspense, useMemo } from "react";
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

  const { data: scores, isLoading: isScoreLoading } = useReviewScoresQuery();

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

  const {
    currentData,
    currentIsLoading,
    currentFetchNextPage,
    currentHasNextPage,
    currentIsFetchingNextPage,
  } = useMemo(
    () => ({
      currentData: currentTab === "dallemfit" ? dallaemfitData : workationData,
      currentIsLoading:
        currentTab === "dallemfit" ? isDallaemfitLoading : isWorkationLoading,
      currentFetchNextPage:
        currentTab === "dallemfit" ? fetchNextDallaemfit : fetchNextWorkation,
      currentHasNextPage:
        currentTab === "dallemfit" ? hasNextDallaemfit : hasNextWorkation,
      currentIsFetchingNextPage:
        currentTab === "dallemfit"
          ? isFetchingNextDallaemfit
          : isFetchingNextWorkation,
    }),
    [
      currentTab,
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

  const allReviews = currentData?.pages.flatMap((page) => page.data) ?? [];

  const filteredReviews =
    currentTab === "dallemfit" && dallaemfitFilter === "all"
      ? allReviews.filter((review) =>
          ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"].includes(
            review.Gathering.type,
          ),
        )
      : allReviews;

  const observerTarget = useInfiniteScroll(
    currentFetchNextPage,
    currentHasNextPage,
    currentIsFetchingNextPage,
  );

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
          showTypeFilter={currentTab === "dallemfit"}
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
          <ReviewList
            reviews={currentTab === "dallemfit" ? filteredReviews : allReviews}
            isLoading={currentIsLoading}
          />

          <div
            ref={observerTarget}
            className="flex h-10 items-center justify-center"
          >
            {currentIsFetchingNextPage && (
              <LoaderCircle className="mt-6 animate-spin text-gray-400" />
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