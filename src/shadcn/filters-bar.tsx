"use client";

import * as React from "react";
import { Chip } from "@/shared/components/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";
import type { Location, SortBy } from "@/shared/services/review/review.service";

type DallaemfitFilter = "all" | "OFFICE_STRETCHING" | "MINDFULNESS";

const LOCATIONS: Array<{ value: Location | "all"; label: string }> = [
  { value: "all", label: "지역 전체" },
  { value: "건대입구", label: "건대입구" },
  { value: "을지로3가", label: "을지로3가" },
  { value: "신림", label: "신림" },
  { value: "홍대입구", label: "홍대입구" },
];

const SORTS: Array<{ value: SortBy; label: string }> = [
  { value: "createdAt", label: "최신순" },
  { value: "score", label: "별점순" },
  { value: "participantCount", label: "마감임박순" },
];

interface ReviewFiltersBarProps {
  // 타입 필터 (달램핏 탭에서만 사용)
  showTypeFilter?: boolean;
  dallaemfitFilter: DallaemfitFilter;
  setDallaemfitFilter: (v: DallaemfitFilter) => void;

  // 지역 필터
  selectedLocation: Location | "all";
  setSelectedLocation: (v: Location | "all") => void;

  // 날짜 필터
  selectedDate: string | undefined;
  setSelectedDate: (d: string | undefined) => void;

  // 정렬 필터
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
}

export default function FiltersBar({
  showTypeFilter = true,
  dallaemfitFilter,
  setDallaemfitFilter,
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  sortBy,
  setSortBy,
}: ReviewFiltersBarProps) {
  // 선택된 지역의 라벨 찾기
  const regionLabel =
    LOCATIONS.find((loc) => loc.value === selectedLocation)?.label ||
    "지역 전체";

  // 선택된 정렬의 라벨 찾기
  const sortLabel = SORTS.find((sort) => sort.value === sortBy)?.label || "최신순";

  // 날짜를 Date 객체로 변환
  const dateValue = selectedDate ? new Date(selectedDate) : null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      setSelectedDate(`${year}-${month}-${day}`);
    } else {
      setSelectedDate(undefined);
    }
  };

  return (
    <div className="mx-4 mb-3 md:mx-0 md:flex md:flex-row md:justify-between">
      {/* 타입 필터 - 달램핏 탭에서만 표시 */}
      {showTypeFilter && (
        <div className="mb-2 flex flex-row gap-2 md:mb-0">
          <Chip
            onClick={() => setDallaemfitFilter("all")}
            variant={dallaemfitFilter === "all" ? "dark" : "light"}
            className="cursor-pointer"
          >
            전체
          </Chip>
          <Chip
            onClick={() => setDallaemfitFilter("OFFICE_STRETCHING")}
            variant={dallaemfitFilter === "OFFICE_STRETCHING" ? "dark" : "light"}
            className="cursor-pointer"
          >
            오피스 스트레칭
          </Chip>
          <Chip
            onClick={() => setDallaemfitFilter("MINDFULNESS")}
            variant={dallaemfitFilter === "MINDFULNESS" ? "dark" : "light"}
            className="cursor-pointer"
          >
            마인드풀니스
          </Chip>
        </div>
      )}

      <div className="flex flex-row gap-2">
        {/* 지역 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
              {regionLabel}
              <img src="/image/ic_arrow.svg" sizes="100vw" alt="dropdown icon" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
            {LOCATIONS.map((location) => (
              <DropdownMenuItem
                key={location.value}
                onSelect={() => setSelectedLocation(location.value)}
                data-selected={selectedLocation === location.value}
                className="rounded-lg data-[highlighted]:bg-gray-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
              >
                {location.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 날짜 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
              {dateValue
                ? dateValue.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "날짜 선택"}
              <img src="/image/ic_arrow.svg" alt="dropdown icon" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto rounded-lg p-3 shadow-sm">
            <input
              type="date"
              value={selectedDate || ""}
              onChange={(e) =>
                handleDateChange(e.target.value ? new Date(e.target.value) : null)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="mt-2 w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                날짜 초기화
              </button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 정렬 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
              <img
                src="/image/ic_filter.svg"
                alt="filter icon"
                className="h-4.5 w-4.5 pr-1"
              />
              {sortLabel}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
            {SORTS.map((sort) => (
              <DropdownMenuItem
                key={sort.value}
                onSelect={() => setSortBy(sort.value)}
                data-selected={sortBy === sort.value}
                className="rounded-md data-[highlighted]:bg-gray-100 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
              >
                {sort.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}