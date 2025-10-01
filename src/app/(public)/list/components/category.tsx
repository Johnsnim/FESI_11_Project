"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/tabs";
import { useQuery } from "@tanstack/react-query";
import { Chip } from "@/shared/components/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover";
import { Calendar } from "@/shadcn/calendar";
import {
  Gathering,
  gatheringService,
} from "@/shared/services/gathering/gathering.service";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";

import type {
  GatheringListParams,
  GatheringType,
} from "@/shared/services/gathering/endpoints";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/pagination";
import { cn } from "@/shadcn/lib/utils";
import Image from "next/image";
import EmptyBanner from "@/features/list/components/emptybanner";
import Card from "@/shared/components/card";

const LOCATIONS = [
  "지역 전체",
  "홍대입구",
  "을지로 3가",
  "신림",
  "건대입구",
] as const;
const SORTS = ["마감임박", "참여 인원 순"] as const;

type DalCategory = "전체" | "오피스 스트레칭" | "마인드풀니스";
const LIMIT = 20;

function fmtDateLabel(d: Date | null) {
  if (!d) return "날짜 전체";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function Category() {
  const [value, setValue] = React.useState<"dal" | "wor">("dal");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const [regionLabel, setRegionLabel] =
    React.useState<(typeof LOCATIONS)[number]>("지역 전체");
  const [sortLabel, setSortLabel] =
    React.useState<(typeof SORTS)[number]>("마감임박");
  const [dalCategory, setDalCategory] = React.useState<DalCategory>("전체");

  const [date, setDate] = React.useState<Date | null>(null);
  const [tempDate, setTempDate] = React.useState<Date | null>(null);
  const [dateOpen, setDateOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);

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

  const items = data ?? [];
  const hasNextPage = items.length === LIMIT;
  const hasPrevPage = page > 1;

  function onPageChange(next: number) {
    if (next < 1) return;
    if (!hasNextPage && next > page) return;
    setPage(next);

    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function visiblePages(current: number) {
    const windowSize = 0;
    const start = Math.max(1, current - windowSize);
    const end = current + windowSize;
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }

  function PaginationBar() {
    const pages = visiblePages(page);

    return (
      <Pagination className="mt-6 flex justify-center">
        <PaginationContent className="gap-6 md:gap-12">
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!hasPrevPage}
              onClick={() => hasPrevPage && onPageChange(page - 1)}
              className={cn(
                "border-0 bg-transparent text-gray-300 hover:bg-transparent hover:text-gray-400",
                hasPrevPage && "text-gray-500 hover:text-gray-700",
              )}
            />
          </PaginationItem>

          {/* 페이지 번호들 */}
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => onPageChange(p)}
                isActive={p === page}
                className={cn(
                  "h-12 w-12 rounded-3xl border-0 bg-transparent text-xl leading-none text-gray-400 hover:text-gray-600",
                  "flex items-center justify-center",
                  p === page && "bg-green-100 text-green-600",
                )}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {hasNextPage && (
            <>
              <PaginationItem>
                <PaginationEllipsis className="text-gray-300" />
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={!hasNextPage}
              onClick={() => hasNextPage && onPageChange(page + 1)}
              className={cn(
                "border-0 bg-transparent hover:bg-transparent",
                hasNextPage ? "text-slate-900" : "text-gray-300",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as "dal" | "wor")}>
      <div ref={wrapRef} className="relative w-full">
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] bg-transparent md:bg-gray-200" />
        <TabsList className="flex h-16 w-full gap-0 bg-transparent p-0 md:w-fit md:gap-6">
          <TabsTrigger
            value="dal"
            className="h-auto flex-1 cursor-pointer border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <Image src="/image/ic_mind_sm.svg" alt="dallem icon" />
            달램핏
          </TabsTrigger>
          <TabsTrigger
            value="wor"
            className="h-auto flex-1 cursor-pointer rounded-none border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <Image src="/image/ic_ parasol_sm.svg" alt="workcation icon" />
            워케이션
          </TabsTrigger>
        </TabsList>
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-green-600 transition-[width,transform] duration-300"
          style={indicatorStyle}
        />
      </div>

      {/* 달램핏 */}
      <TabsContent value="dal" className="mt-4">
        <div className="mb-3 md:flex md:flex-row md:justify-between">
          <div className="mb-2 flex flex-row gap-2 md:mb-0">
            <Chip
              onClick={() => setDalCategory("전체")}
              variant={dalCategory === "전체" ? "dark" : "light"}
              className="cursor-pointer"
            >
              전체
            </Chip>
            <Chip
              onClick={() => setDalCategory("오피스 스트레칭")}
              variant={dalCategory === "오피스 스트레칭" ? "dark" : "light"}
              className="cursor-pointer"
            >
              오피스 스트레칭
            </Chip>
            <Chip
              onClick={() => setDalCategory("마인드풀니스")}
              variant={dalCategory === "마인드풀니스" ? "dark" : "light"}
              className="cursor-pointer"
            >
              마인드풀니스
            </Chip>
          </div>

          <div className="flex flex-row gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
                  {regionLabel}
                  <Image
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

            <Popover
              open={dateOpen}
              onOpenChange={(o) => {
                setDateOpen(o);
                if (o) setTempDate(date);
              }}
            >
              <PopoverTrigger asChild>
                <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
                  {fmtDateLabel(date)}
                  <Image
                    src="/image/ic_arrow_dropdown_down.svg"
                    alt="dropdown icon"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="rounded-3xl p-3 shadow-sm">
                <div className="flex h-full flex-col">
                  <Calendar
                    mode="single"
                    showOutsideDays
                    selected={tempDate ?? undefined}
                    onSelect={(d) => setTempDate(d ?? null)}
                    className="flex-1 rounded-2xl p-1"
                    classNames={{
                      months: "flex flex-col",
                      month: "space-y-3",
                      caption: "flex justify-between items-center px-2 pt-1",
                      caption_label: "text-sm font-semibold text-gray-800",
                      nav: "flex items-center gap-2",
                      nav_button:
                        "size-8 rounded-md text-gray-600 hover:bg-green-100",
                      table: "w-full border-collapse",
                      head_row: "grid grid-cols-7 text-center",
                      head_cell: "text-xs font-medium text-gray-400 pb-1",
                      row: "grid grid-cols-7 text-center gap-y-1",
                      cell: "p-0",
                      day: "h-9 w-9 mx-auto grid place-items-center rounded-full text-sm text-gray-700 hover:bg-green-100 focus:bg-green-100 focus:outline-none",
                      day_today: "text-green-600",
                      day_selected:
                        "bg-green-600 text-white hover:bg-green-600 focus:bg-green-600",
                      day_outside: "text-gray-300",
                      day_disabled: "text-gray-300 opacity-50",
                    }}
                  />
                  <div className="mt-3 flex justify-between">
                    <button
                      className="h-9 cursor-pointer rounded-lg border border-green-600 px-4 text-sm font-semibold text-green-600 hover:bg-green-100"
                      onClick={() => {
                        setTempDate(null);
                        setDate(null);
                        setDateOpen(false);
                      }}
                    >
                      초기화
                    </button>
                    <button
                      className="h-9 cursor-pointer rounded-lg bg-green-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
                      disabled={!tempDate}
                      onClick={() => {
                        setDate(tempDate);
                        setDateOpen(false);
                      }}
                    >
                      적용
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
                  {sortLabel}
                  <Image
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

        {isLoading && <CardSkeletonGrid />}
        {isError && <EmptyBanner />}

        {!isLoading &&
          !isError &&
          (items.length === 0 ? (
            <EmptyBanner />
          ) : (
            <>
              <div className="lg:grid lg:grid-cols-2 lg:gap-3">
                {items.map((g: Gathering) => (
                  <Card
                    key={g.id}
                    id={g.id}
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
              <PaginationBar />
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
              <div className="lg:grid lg:grid-cols-2 lg:gap-3">
                {items.map((g: Gathering) => (
                  <Card
                    key={g.id}
                    id={g.id}
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
              <PaginationBar />
            </>
          ))}
      </TabsContent>
    </Tabs>
  );
}
