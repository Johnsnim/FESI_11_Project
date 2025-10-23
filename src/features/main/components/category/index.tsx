"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/shadcn/tabs";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Gathering,
  gatheringService,
} from "@/shared/services/gathering/gathering.service";
import EmptyBanner from "../emptybanner";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";
import type {
  GatheringListParams,
  GatheringType,
} from "@/shared/services/gathering/endpoints";

import { LOCATIONS, SORTS, DalCategory } from "./constants";
import FiltersBar from "./filterbar";
import { TabsBar } from "./tabsbar";
import { ItemsGrid } from "./itemsgrid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 30;

export default function Category() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const value: "dal" | "wor" = tabParam === "workation" ? "wor" : "dal";

  const pushWithTab = React.useCallback(
    (next: "dal" | "wor") => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", next === "wor" ? "workation" : "dallemfit");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const [regionLabel, setRegionLabel] =
    React.useState<(typeof LOCATIONS)[number]>("지역 전체");
  const [sortLabel, setSortLabel] =
    React.useState<(typeof SORTS)[number]>("마감임박");
  const [dalCategory, setDalCategory] = React.useState<DalCategory>("전체");
  const [date, setDate] = React.useState<Date | null>(null);

  const locationParam = regionLabel === "지역 전체" ? undefined : regionLabel;
  const sortBy =
    sortLabel === "마감임박" ? "registrationEnd" : "participantCount";
  const sortOrder = sortLabel === "마감임박" ? "asc" : "desc";
  const dateParam = date ? date.toISOString().slice(0, 10) : undefined;

  const typeParam: GatheringType | undefined =
    value === "wor"
      ? ("WORKATION" as GatheringType)
      : dalCategory === "오피스 스트레칭"
        ? ("OFFICE_STRETCHING" as GatheringType)
        : dalCategory === "마인드풀니스"
          ? ("MINDFULNESS" as GatheringType)
          : ("DALLAEMFIT" as GatheringType);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "gatherings",
      {
        tab: value,
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        limit: PAGE_SIZE,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      gatheringService.list({
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        limit: PAGE_SIZE,
        offset: pageParam,
      } satisfies GatheringListParams),
    initialPageParam: 0,
    getNextPageParam: (lastPage: Gathering[], allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const items: Gathering[] = React.useMemo(
    () => (data?.pages ? data.pages.flat() : []),
    [data],
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [value, regionLabel, sortLabel, dalCategory, date]);

  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "1000px 0px 600px 0px",
        threshold: 0,
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Tabs
      value={value}
      onValueChange={(v) => pushWithTab(v as "dal" | "wor")}
      className="mb-7"
    >
      <TabsBar value={value} onChange={(v) => pushWithTab(v)} />

      {/* 달램핏 */}
      <TabsContent value="dal" className="mt-4">
        <FiltersBar
          regionLabel={regionLabel}
          setRegionLabel={setRegionLabel}
          sortLabel={sortLabel}
          setSortLabel={setSortLabel}
          dalCategory={dalCategory}
          setDalCategory={setDalCategory}
          date={date}
          setDate={setDate}
        />

        {isLoading && <CardSkeletonGrid />}
        {isError && <EmptyBanner />}

        {!isLoading && !isError && (
          <>
            {items.length === 0 ? (
              <EmptyBanner />
            ) : (
              <>
                <ItemsGrid items={items} />

                <div ref={loaderRef} className="h-10" />
                {isFetchingNextPage && <CardSkeletonGrid count={1} />}
              </>
            )}
          </>
        )}
      </TabsContent>

      {/* 워케이션 */}
      <TabsContent value="wor" className="mt-4">
        {isLoading && <CardSkeletonGrid />}
        {isError && <EmptyBanner />}

        {!isLoading && !isError && (
          <>
            {items.length === 0 ? (
              <EmptyBanner />
            ) : (
              <>
                <ItemsGrid items={items} />
                <div ref={loaderRef} className="h-10" />
                {isFetchingNextPage && <CardSkeletonGrid count={1} />}
              </>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
