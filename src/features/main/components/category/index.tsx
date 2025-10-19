"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/shadcn/tabs";
import { useQuery } from "@tanstack/react-query";
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

import { LOCATIONS, SORTS, LIMIT, DalCategory } from "./constants";
import FiltersBar from "./filterbar";
import { TabsBar } from "./tabsbar";
import { ItemsGrid } from "./itemsgrid";
import { PaginationBar } from "./pagenationbar";

export default function Category() {
  const [value, setValue] = React.useState<"dal" | "wor">("dal");

  // 필터 상태
  const [regionLabel, setRegionLabel] =
    React.useState<(typeof LOCATIONS)[number]>("지역 전체");
  const [sortLabel, setSortLabel] =
    React.useState<(typeof SORTS)[number]>("마감임박");
  const [dalCategory, setDalCategory] = React.useState<DalCategory>("전체");
  const [date, setDate] = React.useState<Date | null>(null);

  // 페이지네이션
  const [page, setPage] = React.useState(1);

  // 탭/필터 변경 되면 페이지 리셋되도록
  React.useEffect(() => {
    setPage(1);
  }, [value, regionLabel, sortLabel, dalCategory, date]);

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

  const offset = (page - 1) * LIMIT;

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "gatherings",
      {
        tab: value,
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        page,
        limit: LIMIT,
      },
    ],
    queryFn: () =>
      gatheringService.list({
        type: typeParam,
        location: locationParam,
        sortBy,
        sortOrder,
        date: dateParam,
        limit: LIMIT,
        offset,
      } satisfies GatheringListParams),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const items = (data ?? []) as Gathering[];
  const hasNextPage = items.length === LIMIT;
  const hasPrevPage = page > 1;

  function onPageChange(next: number) {
    if (next < 1) return;
    if (!hasNextPage && next > page) return;
    setPage(next);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Tabs
      value={value}
      onValueChange={(v) => setValue(v as "dal" | "wor")}
      className="mb-7"
    >
      <TabsBar value={value} onChange={(v) => setValue(v)} />

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

        {!isLoading &&
          !isError &&
          (items.length === 0 ? (
            <EmptyBanner />
          ) : (
            <>
              <ItemsGrid items={items} />
              <PaginationBar
                page={page}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onPageChange={onPageChange}
              />
            </>
          ))}
      </TabsContent>

      {/* 워케이션 */}
      <TabsContent value="wor" className="mt-4">
        {isLoading && <CardSkeletonGrid />}
        {isError && <EmptyBanner />}
        {!isLoading &&
          !isError &&
          (items.length === 0 ? (
            <EmptyBanner />
          ) : (
            <>
              <ItemsGrid items={items} />
              <PaginationBar
                page={page}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onPageChange={onPageChange}
              />
            </>
          ))}
      </TabsContent>
    </Tabs>
  );
}
