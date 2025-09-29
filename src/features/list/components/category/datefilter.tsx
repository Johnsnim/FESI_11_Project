"use client";

import * as React from "react";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover";
import { Calendar } from "@/shadcn/calendar";
import { fmtDateLabel } from "./utils";

export function DateFilter({
  date,
  onChange,
}: {
  date: Date | null;
  onChange: (d: Date | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | null>(null);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setTempDate(date);
      }}
    >
      <PopoverTrigger asChild>
        <button className="flex cursor-pointer items-center px-2 py-2 text-sm font-medium text-gray-500">
          {fmtDateLabel(date)}
          <Image src="/image/ic_arrow_dropdown_down.svg" alt="dropdown icon" />
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
              nav_button: "size-8 rounded-md text-gray-600 hover:bg-green-100",
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
                onChange(null);
                setOpen(false);
              }}
            >
              초기화
            </button>
            <button
              className="h-9 cursor-pointer rounded-lg bg-green-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
              disabled={!tempDate}
              onClick={() => {
                onChange(tempDate);
                setOpen(false);
              }}
            >
              적용
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
