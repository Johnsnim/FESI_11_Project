"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover";
import { Calendar } from "@/shadcn/calendar";
import { CreateGatheringForm } from "@/shared/components/modals/create/types";

function fmtDateLabel(d: Date | null) {
  if (!d) return "날짜를 입력해주세요";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

type AMPMType = "AM" | "PM";
const AMPM = ["AM", "PM"] as const;
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function toH12(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes();
  const ap: AMPMType = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { h12: h, m, ap };
}

function fromH12(base: Date, h12: number, m: number, ap: AMPMType) {
  const d = new Date(base);
  let h24 = h12 % 12;
  if (ap === "PM") h24 += 12;
  d.setHours(h24, m, 0, 0);
  return d;
}

function TimeColumn<T extends number | string>({
  values,
  selected,
  onSelect,
  format = (v: T) =>
    typeof v === "number" ? String(v).padStart(2, "0") : String(v),
}: {
  values: readonly T[] | T[];
  selected: T;
  onSelect: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="scroll-modal max-h-[310px] w-16 overflow-y-auto py-2">
      {values.map((v) => {
        const isSel = v === selected;
        return (
          <button
            key={String(v)}
            onClick={() => onSelect(v)}
            className={[
              "mx-auto mb-1 grid h-8 w-12 place-items-center rounded-md text-sm transition-colors",
              isSel
                ? "bg-green-200 font-semibold text-green-600"
                : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            {format(v)}
          </button>
        );
      })}
    </div>
  );
}

const calendarClasses = {
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
  day: "h-9 w-9 mx-auto grid place-items-center rounded-full text-sm text-gray-700 hover:bg-green-100 focus:bg-green-100",
  day_today: "text-green-600",
  day_selected: "bg-green-600 text-white hover:bg-green-600 focus:bg-green-600",
  day_outside: "text-gray-300",
  day_disabled: "text-gray-300 opacity-50",
} as const;

type DateKey = "date" | "registrationEnd";

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

  // any 대신 키를 한정하고, null이면 새 Date로 대체
  function ensureBase(key: DateKey): Date {
    const cur = data[key];
    return (cur ?? new Date()) as Date;
  }

  function setDateOnly(key: DateKey, next: Date | null) {
    if (!next) {
      setField(
        key as keyof CreateGatheringForm,
        null as unknown as CreateGatheringForm[typeof key],
      );
      return;
    }
    const cur = ensureBase(key);
    const { h12, m, ap } = toH12(cur);
    const merged = fromH12(next, h12, m, ap);
    setField(
      key as keyof CreateGatheringForm,
      merged as unknown as CreateGatheringForm[typeof key],
    );
  }

  function setTimeOnly(
    key: DateKey,
    part: "hour" | "minute" | "ampm",
    value: number | AMPMType,
  ) {
    const cur = ensureBase(key);
    const { h12, m, ap } = toH12(cur);
    const nh = part === "hour" ? (value as number) : h12;
    const nm = part === "minute" ? (value as number) : m;
    const nap: AMPMType = part === "ampm" ? (value as AMPMType) : ap;
    const merged = fromH12(cur, nh, nm, nap);
    setField(
      key as keyof CreateGatheringForm,
      merged as unknown as CreateGatheringForm[typeof key],
    );
  }

  const dateH = data.date ? toH12(data.date) : toH12(new Date());
  const regH = data.registrationEnd
    ? toH12(data.registrationEnd)
    : toH12(new Date());

  return (
    <div className="space-y-5">
      {/* 모임 날짜/시간 */}
      <div>
        <div className="mb-2 text-sm font-medium">모임 날짜</div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-xl bg-[#F9FAFB] px-3 py-2 text-left text-sm text-gray-400">
              {fmtDateLabel(data.date)}
              <img
                src="/image/ic_calendar_sm.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="z-50 w-fit overflow-hidden rounded-3xl bg-white p-0 shadow-xl ring-1 ring-black/5"
          >
            <div className="flex h-80">
              <div className="w-[300px] pl-4">
                <Calendar
                  mode="single"
                  showOutsideDays
                  selected={data.date ?? undefined}
                  onSelect={(d) => setDateOnly("date", d ?? null)}
                  className="rounded-2xl p-1"
                  classNames={calendarClasses}
                />
              </div>

              <div className="my-6 w-px bg-gray-200" />

              <div className="flex items-start gap-6 bg-white px-4 py-3">
                <div className="text-center">
                  <TimeColumn
                    values={HOURS_12}
                    selected={dateH.h12}
                    onSelect={(v) => setTimeOnly("date", "hour", v)}
                  />
                </div>

                <div className="text-center">
                  <TimeColumn
                    values={MINUTES}
                    selected={Math.floor(dateH.m / 5) * 5}
                    onSelect={(v) => setTimeOnly("date", "minute", v)}
                  />
                </div>

                <div className="text-center">
                  <TimeColumn
                    values={AMPM}
                    selected={dateH.ap}
                    onSelect={(v) => setTimeOnly("date", "ampm", v)}
                    format={(v) => v}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 마감 날짜/시간 */}
      <div>
        <div className="mb-2 text-sm font-medium">마감 날짜</div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-xl bg-[#F9FAFB] px-3 py-2 text-left text-sm text-gray-400">
              {fmtDateLabel(data.registrationEnd)}
              <img
                src="/image/ic_calendar_sm.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="z-50 w-[680px] overflow-hidden rounded-3xl bg-white p-0 shadow-xl ring-1 ring-black/5"
          >
            <div className="flex h-90 items-stretch">
              <div className="w-[360px] p-3">
                <Calendar
                  mode="single"
                  showOutsideDays
                  selected={data.registrationEnd ?? undefined}
                  onSelect={(d) => setDateOnly("registrationEnd", d ?? null)}
                  className="rounded-2xl p-1"
                  classNames={calendarClasses}
                />
              </div>

              <div className="my-2 w-px bg-gray-200" />

              <div className="flex flex-1 items-start gap-6 bg-white px-4 py-3">
                <div className="text-center">
                  <TimeColumn
                    values={HOURS_12}
                    selected={regH.h12}
                    onSelect={(v) => setTimeOnly("registrationEnd", "hour", v)}
                  />
                </div>
                <div className="text-center">
                  <TimeColumn
                    values={MINUTES}
                    selected={Math.floor(regH.m / 5) * 5}
                    onSelect={(v) =>
                      setTimeOnly("registrationEnd", "minute", v)
                    }
                  />
                </div>
                <div className="text-center">
                  <TimeColumn
                    values={AMPM}
                    selected={regH.ap}
                    onSelect={(v) => setTimeOnly("registrationEnd", "ampm", v)}
                    format={(v) => v}
                  />
                </div>
              </div>
            </div>
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
            setField(
              "capacity",
              v === ""
                ? ("" as unknown as CreateGatheringForm["capacity"])
                : (Math.max(
                    0,
                    Number(v),
                  ) as unknown as CreateGatheringForm["capacity"]),
            );
          }}
        />
      </div>
    </div>
  );
}
