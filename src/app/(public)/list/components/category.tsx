"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/tabs";

import Card from "@/shared/components/card";
import { Chip } from "@/shared/components/chip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";

export default function Category() {
  const [value, setValue] = React.useState("dal");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const [regionLabel, setRegionLabel] = React.useState("지역 전체");
  const [sortLabel, setSortLabel] = React.useState("마감임박");

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

      {/* 달램핏 */}
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
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onSelect={() => setRegionLabel("지역 전체")}>
                  지역 전체
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setRegionLabel("홍대입구")}>
                  홍대입구
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setRegionLabel("을지로 3가")}>
                  을지로 3가
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setRegionLabel("신림")}>
                  신림
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setRegionLabel("건대입구")}>
                  건대입구
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500"
              onClick={() => {
                /* datepicker 추가해야함 */
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
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onSelect={() => setSortLabel("마감임박")}>
                  마감임박
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortLabel("참여 인원 순")}>
                  참여 인원 순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-3">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </TabsContent>

      {/* 워케이션 */}
      <TabsContent value="wor" className="mt-4">
        워케이션탭
      </TabsContent>
    </Tabs>
  );
}
