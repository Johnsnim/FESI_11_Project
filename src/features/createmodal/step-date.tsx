"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover";
import { Calendar } from "@/shadcn/calendar";
import { CreateGatheringForm } from "@/shared/components/modals/create/types";
import Image from "next/image";

function fmtDateLabel(d: Date | null) {
  if (!d) return "날짜를 입력해주세요";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function StepDate({
  data,
  onChange,
}: {
  data: CreateGatheringForm;
  onChange: (d: CreateGatheringForm) => void;
}) {
  function setField<K extends keyof CreateGatheringForm>(
    key: K,
    value: CreateGatheringForm[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-sm font-medium">모임 날짜</div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-xl bg-[#F9FAFB] px-3 py-2 text-left text-sm text-gray-400">
              {fmtDateLabel(data.date)}
              <Image
                src="/image/ic_calendar.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-3xl p-3 shadow-sm">
            <Calendar
              mode="single"
              showOutsideDays
              selected={data.date ?? undefined}
              onSelect={(d) => setField("date", d ?? null)}
              className="rounded-2xl p-1"
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
                day: "h-9 w-9 mx-auto grid place-items-center rounded-full text-sm text-gray-700 hover:bg-green-100 focus:bg-green-100",
                day_today: "text-green-600",
                day_selected:
                  "bg-green-600 text-white hover:bg-green-600 focus:bg-green-600",
                day_outside: "text-gray-300",
                day_disabled: "text-gray-300 opacity-50",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">마감 날짜</div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-xl bg-[#F9FAFB] px-3 py-2 text-left text-sm text-gray-400">
              {fmtDateLabel(data.registrationEnd)}
              <Image
                src="/image/ic_calendar.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-3xl p-3 shadow-sm">
            <Calendar
              mode="single"
              showOutsideDays
              selected={data.registrationEnd ?? undefined}
              onSelect={(d) => setField("registrationEnd", d ?? null)}
              className="rounded-2xl p-1"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">모임 정원</div>
        <input
          type="number"
          min={1}
          placeholder="모집 정원을 입력해주세요"
          className="w-full rounded-xl bg-[#F9FAFB] px-3 py-2 text-left text-sm placeholder:text-gray-400 focus:outline-none"
          value={data.capacity}
          onChange={(e) => {
            const v = e.target.value;
            setField("capacity", v === "" ? "" : Math.max(0, Number(v)));
          }}
        />
      </div>
    </div>
  );
}
