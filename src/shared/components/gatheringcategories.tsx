"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsContent } from "@/shadcn/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CardSkeletonGrid } from "@/shared/components/cardskeleton";
import {
  gatheringService,
  type Gathering,
} from "@/shared/services/gathering/gathering.service";
import type {
  GatheringListParams,
  GatheringType,
} from "@/shared/services/gathering/endpoints";
import {
  DalCategory,
  LOCATIONS,
  SORTS,
} from "@/features/main/components/category/constants";
import { TabsBar } from "@/features/main/components/category/tabsbar";
import FiltersBar from "@/features/main/components/category/filterbar";
import EmptyBanner from "@/features/main/components/emptybanner";
import { ItemsGrid } from "@/features/main/components/category/itemsgrid";

type Props =
  | { mode: "all" }
  | { mode: "dibs"; getIds: () => number[] | Promise<number[]> };

const PAGE_SIZE = 30;

export default function GatheringCategory(props: Props) {
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
      ? "WORKATION"
      : dalCategory === "오피스 스트레칭"
        ? "OFFICE_STRETCHING"
        : dalCategory === "마인드풀니스"
          ? "MINDFULNESS"
          : "DALLAEMFIT";

  const [allIds, setAllIds] = React.useState<number[] | null>(
    props.mode === "dibs" ? null : null,
  );

  React.useEffect(() => {
    if (props.mode !== "dibs") return;
    let alive = true;
    (async () => {
      const ids = await props.getIds();
      if (!alive) return;
      const normalized = Array.from(new Set(ids))
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n));
      setAllIds(normalized);
    })();
    return () => {
      alive = false;
    };
  }, [props.mode, "getIds" in props ? props.getIds : null]);

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
        mode: props.mode,
        idsHash: props.mode === "dibs" ? (allIds ?? []).join(",") : undefined,
        tab: value,
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        limit: PAGE_SIZE,
      },
    ],
    enabled: props.mode === "all" ? true : allIds !== null,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = Number(pageParam) || 0;

      if (props.mode === "all") {
        return gatheringService.list({
          type: typeParam,
          location: locationParam,
          sortBy,
          sortOrder,
          date: dateParam,
          limit: PAGE_SIZE,
          offset,
        } satisfies GatheringListParams);
      }

      const ids = allIds ?? [];
      const slice = ids.slice(offset, offset + PAGE_SIZE);
      if (slice.length === 0) return [];
      return gatheringService.list({
        id: slice,
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        limit: slice.length,
      } satisfies GatheringListParams);
    },
    getNextPageParam: (_last, _pages, lastPageParam) => {
      if (props.mode === "all") {
        const next = (Number(lastPageParam) || 0) + PAGE_SIZE;
        return next;
      }
      const ids = allIds ?? [];
      const next = (Number(lastPageParam) || 0) + PAGE_SIZE;
      return next < ids.length ? next : undefined;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const pages = data?.pages ?? [];
  const items: Gathering[] = React.useMemo(() => pages.flat(), [pages]);

  const computedHasNext =
    props.mode === "all"
      ? pages.length > 0 && pages[pages.length - 1]?.length === PAGE_SIZE
      : hasNextPage;

  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          computedHasNext &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "1000px 0px 600px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [computedHasNext, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [value, regionLabel, sortLabel, dalCategory, date, props.mode]);

  return (
    <Tabs
      value={value}
      onValueChange={(v) => pushWithTab(v as "dal" | "wor")}
      className="mb-7"
    >
      <TabsBar value={value} onChange={(v) => pushWithTab(v)} />

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
                {computedHasNext && <div ref={loaderRef} className="h-10" />}
                {isFetchingNextPage && <CardSkeletonGrid count={1} />}
              </>
            )}
          </>
        )}
      </TabsContent>

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
                {computedHasNext && <div ref={loaderRef} className="h-10" />}
                {isFetchingNextPage && <CardSkeletonGrid count={1} />}
              </>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
