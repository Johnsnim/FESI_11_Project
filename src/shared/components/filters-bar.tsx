// filters-bar.tsx
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
import { DateFilter } from "@/features/main/components/category/datefilter";
import { DallaemfitFilter } from "../types/filters";

// 타입 별칭 추가
type LocationFilter = "all" | Location;

const LOCATIONS: Array<{ value: LocationFilter; label: string }> = [
  { value: "all", label: "지역 전체" },
  { value: "건대입구", label: "건대입구" },
  { value: "을지로3가", label: "을지로3가" },
  { value: "신림", label: "신림" },
  { value: "홍대입구", label: "홍대입구" },
];

const DEFAULT_SORTS: Array<{ value: SortBy; label: string }> = [
  { value: "createdAt", label: "최신순" },
  { value: "score", label: "별점순" },
  { value: "participantCount", label: "참여인원순" },
];

interface ReviewFiltersBarProps<T extends string = SortBy> {
  showTypeFilter?: boolean;
  dallaemfitFilter: DallaemfitFilter;
  setDallaemfitFilter: (v: DallaemfitFilter) => void;

  // 타입 수정
  selectedLocation: LocationFilter;
  setSelectedLocation: (v: LocationFilter) => void;

  selectedDate: string | undefined;
  setSelectedDate: (d: string | undefined) => void;

  sortBy: T;
  setSortBy: (s: T) => void;

  sortOptions?: Array<{ value: T; label: string }>;
}

export default function FiltersBar<T extends string = SortBy>({
  showTypeFilter = true,
  dallaemfitFilter,
  setDallaemfitFilter,
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  sortBy,
  setSortBy,
  sortOptions,
}: ReviewFiltersBarProps<T>) {
  const sorts = (sortOptions ?? DEFAULT_SORTS) as Array<{
    value: T;
    label: string;
  }>;

  const regionLabel =
    LOCATIONS.find((loc) => loc.value === selectedLocation)?.label ||
    "지역 전체";

  const sortLabel =
    sorts.find((sort) => sort.value === sortBy)?.label ||
    sorts[0]?.label ||
    null;

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
    <div className="mx-4 md:mx-0 md:flex md:flex-row md:justify-between">
      {showTypeFilter && (
        <div className="flex flex-row gap-2">
          <Chip
            onClick={() => setDallaemfitFilter("all")}
            variant={dallaemfitFilter === "all" ? "dark" : "light"}
            className="cursor-pointer"
          >
            전체
          </Chip>
          <Chip
            onClick={() => setDallaemfitFilter("OFFICE_STRETCHING")}
            variant={
              dallaemfitFilter === "OFFICE_STRETCHING" ? "dark" : "light"
            }
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

      <div
        className={`flex h-10 flex-row gap-2 ${!showTypeFilter ? "md:ml-auto" : ""}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500 focus:outline-none focus-visible:ring-0">
              {regionLabel}
              <img
                src="/image/ic_arrow.svg"
                sizes="100vw"
                alt="dropdown icon"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
            {LOCATIONS.map((location) => (
              <DropdownMenuItem
                key={location.value}
                onSelect={() => setSelectedLocation(location.value)}
                data-selected={selectedLocation === location.value}
                className="rounded-lg focus:outline-none focus-visible:ring-0 data-[highlighted]:bg-green-50 data-[selected=true]:bg-green-100 data-[selected=true]:text-gray-900"
              >
                {location.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DateFilter date={dateValue} onChange={handleDateChange} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500 focus:outline-none focus-visible:ring-0">
              <img
                src="/image/ic_filter.svg"
                alt="filter icon"
                className="h-4.5 w-4.5 pr-1"
              />
              {sortLabel}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-35.5 rounded-lg p-1.5 shadow-sm">
            {sorts.map((sort) => (
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