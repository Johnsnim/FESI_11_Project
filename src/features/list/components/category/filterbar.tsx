"use client";

import * as React from "react";
import { Chip } from "@/shared/components/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";
import { LOCATIONS, SORTS, DalCategory } from "./constants";
import { DateFilter } from "./datefilter";
import Image from "next/image";

export default function FiltersBar({
  regionLabel,
  setRegionLabel,
  sortLabel,
  setSortLabel,
  dalCategory,
  setDalCategory,
  date,
  setDate,
}: {
  regionLabel: (typeof LOCATIONS)[number];
  setRegionLabel: (v: (typeof LOCATIONS)[number]) => void;
  sortLabel: (typeof SORTS)[number];
  setSortLabel: (v: (typeof SORTS)[number]) => void;
  dalCategory: DalCategory;
  setDalCategory: (v: DalCategory) => void;
  date: Date | null;
  setDate: (d: Date | null) => void;
}) {
  return (
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
        {/* 지역 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
              {regionLabel}
              <img
                src="/image/ic_arrow_dropdown_down.svg"
                sizes="100vw"
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

        {/* 날짜 */}
        <DateFilter date={date} onChange={setDate} />

        {/* 정렬 */}
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
  );
}
