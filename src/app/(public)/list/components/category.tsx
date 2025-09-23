"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/tabs";
import { useQuery } from "@tanstack/react-query";
import Card from "@/shared/components/card";
import { Chip } from "@/shared/components/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";
import {
  Gathering,
  gatheringService,
} from "@/shared/services/gathering/gathering.service";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";

const LOCATIONS = [
  "지역 전체",
  "홍대입구",
  "을지로 3가",
  "신림",
  "건대입구",
] as const;
const SORTS = ["마감임박", "참여 인원 순"] as const;

export default function Category() {
  const [value, setValue] = React.useState("dal");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const [regionLabel, setRegionLabel] =
    React.useState<(typeof LOCATIONS)[number]>("지역 전체");
  const [sortLabel, setSortLabel] =
    React.useState<(typeof SORTS)[number]>("마감임박");

  const recalc = React.useCallback(() => {
    const root = wrapRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) return;
    const parentRect = root.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    setIndicatorStyle({
      width: `${rect.width}px`,
      transform: `translateX(${rect.left - parentRect.left}px)`,
    });
  }, []);

  React.useEffect(() => {
    recalc();
  }, [value, recalc]);

  React.useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  const locationParam = regionLabel === "지역 전체" ? undefined : regionLabel;
  const sortBy =
    sortLabel === "마감임박" ? "registrationEnd" : "participantCount";
  const sortOrder = sortLabel === "마감임박" ? "asc" : "desc";

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "gatherings",
      { tab: value, location: locationParam, sortBy, sortOrder },
    ],
    queryFn: () =>
      gatheringService.list({
        location: locationParam,
        sortBy,
        sortOrder,
        limit: 20,
        offset: 0,
      }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const items = data ?? [];

  return (
    <Tabs value={value} onValueChange={setValue}>
      <div ref={wrapRef} className="relative w-full">
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] bg-transparent md:bg-gray-200" />
        <TabsList className="flex h-16 w-full gap-0 bg-transparent p-0 md:w-fit md:gap-6">
          <TabsTrigger
            value="dal"
            className="h-auto flex-1 cursor-pointer border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <img src="/image/ic_mind_sm.svg" alt="dallem icon" />
            달램핏
          </TabsTrigger>
          <TabsTrigger
            value="wor"
            className="h-auto flex-1 cursor-pointer rounded-none border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <img src="/image/ic_ parasol_sm.svg" alt="workcation icon" />
            워케이션
          </TabsTrigger>
        </TabsList>
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-green-600 transition-[width,transform] duration-300"
          style={indicatorStyle}
        />
      </div>

      <TabsContent value="dal" className="mt-4">
        <div className="mb-3 md:flex md:flex-row md:justify-between">
          <div className="mb-2 flex flex-row gap-2 md:mb-0">
            <Chip>전체</Chip>
            <Chip variant="light">오피스 스트레칭</Chip>
            <Chip variant="light">마인드풀니스</Chip>
          </div>

          <div className="flex flex-row gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
                  {regionLabel}
                  <img
                    src="/image/ic_arrow_dropdown_down.svg"
                    alt="dropdown icon"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
                {LOCATIONS.map((label) => (
                  <DropdownMenuItem
                    key={label}
                    onSelect={() => setRegionLabel(label)}
                    data-selected={regionLabel === label}
                    className="rounded-lg data-[highlighted]:bg-gray-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500"
              onClick={() => {
                /* datepicker 추가 예정 */
              }}
            >
              날짜 전체
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
                  {sortLabel}
                  <img
                    src="/image/ic_filter.svg"
                    alt="filter icon"
                    className="pl-1"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
                {SORTS.map((label) => (
                  <DropdownMenuItem
                    key={label}
                    onSelect={() => setSortLabel(label)}
                    data-selected={sortLabel === label}
                    className="rounded-md data-[highlighted]:bg-gray-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 로딩 중에 스켈레톤 나오게 */}
        {isLoading && <CardSkeletonGrid />}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            데이터를 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="lg:grid lg:grid-cols-2 lg:gap-3">
            {items.length === 0 && (
              <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-500">
                표시할 모임이 없습니다.
              </div>
            )}
            {items.map((g: Gathering) => (
              <Card
                key={g.id}
                title={g.name}
                location={g.location}
                dateTimeISO={g.dateTime}
                registrationEndISO={g.registrationEnd ?? undefined}
                participantCount={g.participantCount}
                capacity={g.capacity}
                image={g.image ?? undefined}
                isCanceled={!!g.canceledAt}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="wor" className="mt-4">
        워케이션탭
      </TabsContent>
    </Tabs>
  );
}
