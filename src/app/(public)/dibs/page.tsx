"use client";

import * as React from "react";
import { Suspense, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

import Card from "@/shared/components/card";
import EmptyBanner from "@/features/main/components/emptybanner";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";

import { useUrlFilters } from "@/shared/hooks/use-url-filters";
import { useTabFilters } from "@/shared/hooks/use-tab-filters";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

import PageTabs from "@/shared/components/pagetabs";
import FiltersBar from "@/shared/components/filters-bar";

import { useGatheringsByIdsInfiniteQuery } from "@/shared/services/gathering/use-gathering-queries";

import type { GatheringType } from "@/shared/services/gathering/endpoints";
import { MainPageSortBy } from "@/shared/services/gathering/gathering.service";

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
] as const;

const SORT_OPTIONS: Array<{ value: MainPageSortBy; label: string }> = [
  { value: "registrationEnd", label: "마감임박순" },
  { value: "participantCount", label: "참여인원순" },
  { value: "dateTime", label: "모임시작임박" },
];

const DALLAEMFIT_TYPES = [
  "DALLAEMFIT",
  "OFFICE_STRETCHING",
  "MINDFULNESS",
] as const;

function getUserId(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readWishlistIds(userId: number | null): number[] {
  if (typeof window === "undefined" || userId == null) return [];
  try {
    const raw = localStorage.getItem("wishlist") || "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const arr = parsed[String(userId)];
    if (Array.isArray(arr)) {
      return arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
    }
  } catch {}
  return [];
}

function DibsPageContent() {
  const { data: session } = useSession();
  const userId = getUserId(session?.user?.id);

  const {
    currentTab,
    dallaemfitFilter,
    selectedLocation,
    selectedDate,
    searchParams,
    updateSearchParams,
  } = useUrlFilters({ basePath: "/dibs" });

  const sortBy: MainPageSortBy =
    (searchParams.get("sortBy") as MainPageSortBy) ?? "registrationEnd";

  const handlers = useTabFilters<MainPageSortBy>(
    updateSearchParams,
    currentTab,
  );

  const getIds = useCallback(() => readWishlistIds(userId), [userId]);

  const apiParams = useMemo(() => {
    const type: GatheringType | undefined =
      currentTab === "workation"
        ? "WORKATION"
        : dallaemfitFilter === "all"
          ? undefined
          : (dallaemfitFilter as GatheringType);

    return {
      type,
      location: selectedLocation === "all" ? undefined : selectedLocation,
      date: selectedDate,
      sortBy,
      sortOrder: sortBy === "registrationEnd" ? "asc" : "desc",
    } as const;
  }, [currentTab, dallaemfitFilter, selectedLocation, selectedDate, sortBy]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGatheringsByIdsInfiniteQuery(getIds, apiParams, 40);

  const gatherings = useMemo(() => {
    const items = data?.flatItems ?? [];
    const filtered =
      currentTab === "dallemfit" && dallaemfitFilter === "all"
        ? items.filter((g) =>
            (DALLAEMFIT_TYPES as readonly string[]).includes(g.type),
          )
        : items;

    const now = new Date();
    return filtered
      .map((g) => {
        const isClosed =
          !!g.canceledAt ||
          (g.registrationEnd ? new Date(g.registrationEnd) < now : false);
        return { ...g, __priority: isClosed ? 1 : 0 };
      })
      .sort((a, b) => a.__priority - b.__priority);
  }, [data?.flatItems, currentTab, dallaemfitFilter]);

  const observerTarget = useInfiniteScroll(
    fetchNextPage,
    !!hasNextPage,
    !!isFetchingNextPage,
    { rootMargin: "200px" },
  );

  return (
    <div className="w-full overflow-x-hidden md:px-5 lg:mx-5 lg:mt-10 lg:px-0">
      <div className="flex h-40 w-full flex-row items-center justify-center gap-3 p-4 md:justify-start md:gap-4 lg:mb-2">
        <Image
          src="/image/img_head_heart_lg.svg"
          alt="찜하기 배너 이미지"
          width={102}
          height={83}
          quality={75}
          className="h-[57px] w-[70px] md:h-[83px] md:w-[102px]"
          priority
        />
        <div className="flex flex-col gap-0.5 md:gap-4">
          <p className="text-lg font-semibold text-gray-900 md:text-2xl">
            찜한 모임
          </p>
          <p className="text-base font-medium text-slate-500 md:text-lg">
            마감되기 전에 지금 바로 참여해보세요 👀
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-4 md:mt-7.5 md:mb-6 md:space-y-8 lg:mt-[27px]">
        <PageTabs
          currentTab={currentTab}
          onChange={handlers.handleTabChange}
          tabs={TABS}
          tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
          imageClassName="size-8 md:size-11"
        />

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
      </div>

      {isLoading ? (
        <CardSkeletonGrid count={8} />
      ) : gatherings.length === 0 ? (
        <EmptyBanner />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {gatherings.map((g) => (
            <Card
              key={g.id}
              id={g.id}
              title={g.name}
              location={g.location}
              dateTimeISO={g.dateTime}
              registrationEndISO={g.registrationEnd}
              participantCount={g.participantCount}
              capacity={g.capacity}
              image={g.image}
              isCanceled={!!g.canceledAt}
            />
          ))}

          <div
            ref={observerTarget}
            className="flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <LoaderCircle className="mt-6 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DibsPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩중...</div>}>
      <DibsPageContent />
    </Suspense>
  );
}
