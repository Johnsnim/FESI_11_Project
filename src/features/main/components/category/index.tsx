"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/shadcn/tabs";
import EmptyBanner from "../emptybanner";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";
import { LOCATIONS, SORTS, DalCategory } from "./constants";
import FiltersBar from "./filterbar";
import { TabsBar } from "./tabsbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { GatheringType } from "@/shared/services/gathering/endpoints";
import { ItemsGrid } from "./itemsgrid";
import { useGatheringsInfiniteQuery } from "@/shared/services/gathering/use-gathering-queries";

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

  const location = regionLabel === "지역 전체" ? undefined : regionLabel;
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

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } =
    useGatheringsInfiniteQuery(
      {
        type: typeParam,
        location,
        sortBy,
        sortOrder,
        date: dateParam,
      },
      PAGE_SIZE,
    );

  const items = React.useMemo(() => data?.flatItems ?? [], [data]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [value, regionLabel, sortLabel, dalCategory, date]);

  const computedHasNext =
    (data?.pages?.[data.pages.length - 1]?.length ?? 0) === PAGE_SIZE;

  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && computedHasNext && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "1000px 0px 600px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [computedHasNext, isFetchingNextPage, fetchNextPage]);

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
