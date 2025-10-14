"use client";

import { useRouter } from "next/navigation";
import { Chip } from "./chip";
import { Tag } from "./tag";
import { motion } from "motion/react";
import * as React from "react";

export type CardProps = {
  id: number;
  title: string;
  location: string;
  dateTimeISO: string;
  registrationEndISO?: string | null;
  participantCount: number;
  capacity: number;
  image?: string | null;
  isCanceled?: boolean;
};

export default function Card({
  id,
  title,
  location,
  dateTimeISO,
  registrationEndISO,
  participantCount,
  capacity,
  image,
  isCanceled,
}: CardProps) {
  const router = useRouter();

  const start = new Date(dateTimeISO);
  const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
  const timeLabel = start
    .toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/^0/, "");

  const now = new Date();
  const regEnd = registrationEndISO ? new Date(registrationEndISO) : null;

  const percent =
    capacity > 0
      ? Math.min(100, Math.round((participantCount / capacity) * 100))
      : 0;

  const statusText = isCanceled
    ? "취소됨"
    : regEnd && regEnd < now
      ? "마감"
      : "개설확정";

  const tagLabel = React.useMemo(() => {
    if (!regEnd) return "마감일 미정";
    const now = new Date();
    if (regEnd.getTime() <= now.getTime()) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    const diffMs = regEnd.getTime() - now.getTime();
    const isSameDay =
      regEnd.getFullYear() === now.getFullYear() &&
      regEnd.getMonth() === now.getMonth() &&
      regEnd.getDate() === now.getDate();
    if (diffMs >= dayMs) {
      const days = Math.ceil(diffMs / dayMs);
      return `${days}일 후 마감`;
    }
    if (isSameDay) {
      const hour = regEnd.getHours();
      return `오늘 ${hour}시 마감`;
    }
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow =
      regEnd.getFullYear() === tomorrow.getFullYear() &&
      regEnd.getMonth() === tomorrow.getMonth() &&
      regEnd.getDate() === tomorrow.getDate();
    if (isTomorrow) {
      const hour = regEnd.getHours();
      return `내일 ${hour}시 마감`;
    }
    const hour = regEnd.getHours();
    return `${hour}시 마감`;
  }, [registrationEndISO]);

  return (
    <div className="mb-5 box-border w-full justify-center overflow-hidden rounded-3xl px-4 md:flex md:h-fit md:flex-row md:items-center md:justify-center md:bg-white md:p-6">
      <div className="flex h-39 w-full items-center justify-center rounded-t-3xl bg-[#EDEDED] md:aspect-square md:size-45 md:shrink-0 md:rounded-3xl md:rounded-l-3xl">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full rounded-t-3xl object-cover md:rounded-3xl md:rounded-l-3xl"
          />
        ) : (
          "이미지 들어갈 자리"
        )}
      </div>

      <div className="w-full rounded-b-3xl bg-white p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none md:pt-0 md:pr-0 md:pb-0">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 align-middle">
              <p className="text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800">
                {title}
              </p>
              {statusText === "개설확정" ? (
                <Chip variant="statedone" icon="/image/ic_check_md.svg">
                  {statusText}
                </Chip>
              ) : null}
            </div>
            <p className="text-md mt-1 leading-7 font-medium tracking-[-0.03em] text-gray-400">
              위치
              <span className="pl-2 text-gray-500">{location}</span>
            </p>

            <div className="mt-3 flex items-center gap-2 md:hidden">
              <Chip variant="infomd">{dateLabel}</Chip>
              <Chip variant="infomd">{timeLabel}</Chip>
              {tagLabel && (
                <Tag variant="md" icon="/image/ic_alarm.svg">
                  {tagLabel}
                </Tag>
              )}
            </div>
          </div>

          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100">
            <img
              src="/image/ic_heart_empty.svg"
              alt="heart button"
              className="h-6 w-6"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:mt-7 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 flex-col">
            <div className="hidden items-center gap-2 md:mt-2 md:mb-3 md:flex">
              <Chip variant="infomd">{dateLabel}</Chip>
              <Chip variant="infomd">{timeLabel}</Chip>
              {tagLabel && (
                <Tag variant="md" icon="/image/ic_alarm.svg">
                  {tagLabel}
                </Tag>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center">
                <img
                  src="/image/ic_person.svg"
                  alt="person icon"
                  className="h-4.5 w-4.5"
                />
                <div className="relative ml-1 h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#EAEAEA]">
                  <motion.div
                    className="absolute bottom-0 left-0 rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600 tabular-nums md:ml-3">
                  <span className="text-green-500">{participantCount}</span>/
                  {capacity}
                </span>
              </div>

              <button
                onClick={() => router.push(`/detail/${id}`)}
                className="shrink-0 rounded-2xl border-1 border-green-500 px-6 py-2.5 font-semibold whitespace-nowrap text-green-500 md:hidden"
              >
                참여하기
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push(`/detail/${id}`)}
            className="hidden rounded-2xl border-1 border-green-500 px-6 py-2.5 font-semibold whitespace-nowrap text-green-500 md:block md:self-end"
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
