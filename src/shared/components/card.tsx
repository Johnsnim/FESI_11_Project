"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useWishlist } from "../hooks/use-wishlist";
import { Chip } from "./chip";
import ProgressBar from "./progressbar";
import { Tag } from "./tag";
import WishButton from "./wish-button";

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
  const { isWished, toggleWish } = useWishlist(id);

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

  const isRecruitmentClosed = !!regEnd && regEnd.getTime() <= now.getTime();

  const isDisabled = !!isCanceled || isRecruitmentClosed;

  const isConfirmed =
    !isCanceled && capacity > 0 && participantCount >= capacity;

  const tagLabel = useMemo(() => {
    if (!regEnd) return "마감일 미정";
    const now2 = new Date();
    if (regEnd.getTime() <= now2.getTime()) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    const diffMs = regEnd.getTime() - now2.getTime();
    const isSameDay =
      regEnd.getFullYear() === now2.getFullYear() &&
      regEnd.getMonth() === now2.getMonth() &&
      regEnd.getDate() === now2.getDate();
    if (diffMs >= dayMs) {
      const days = Math.ceil(diffMs / dayMs);
      return `${days}일 후 마감`;
    }
    if (isSameDay) {
      const hour = regEnd.getHours();
      return `오늘 ${hour}시 마감`;
    }
    const tomorrow = new Date(now2);
    tomorrow.setDate(now2.getDate() + 1);
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

  function handleJoin() {
    if (isDisabled) return;
    router.push(`/detail/${id}`);
  }

  return (
    <div className="box-border w-[calc(100%-2rem)] justify-center overflow-hidden rounded-3xl bg-white md:flex md:h-fit md:w-full md:flex-row md:items-center md:justify-center md:p-6">
      <div
        onClick={handleJoin}
        aria-disabled={isDisabled}
        className={[
          "relative flex h-39 w-full items-center justify-center rounded-t-3xl md:aspect-square md:size-45 md:shrink-0 md:rounded-3xl md:rounded-l-3xl",
          image ? "bg-[#EDEDED]" : "bg-[#9DEBCD]",
          isDisabled ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full rounded-t-3xl object-cover md:rounded-3xl md:rounded-l-3xl"
          />
        ) : (
          <img
            src="/image/img_banner_lg.svg"
            alt="배너"
            className="absolute right-0 bottom-0 max-h-full w-[90%] object-contain"
          />
        )}

        {isCanceled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 md:rounded-3xl">
            <span
              className="text-2xl leading-[30px] font-extrabold tracking-[-0.03em] text-white"
              style={{ fontFamily: "Tenada, sans-serif" }}
            >
              취소됨
            </span>
          </div>
        )}

        {!isCanceled && isRecruitmentClosed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 md:rounded-3xl">
            <span
              className="text-2xl leading-[30px] font-extrabold tracking-[-0.03em] text-white"
              style={{ fontFamily: "Tenada, sans-serif" }}
            >
              모집 마감
            </span>
          </div>
        )}
      </div>

      <div className="h-full w-full rounded-b-3xl p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none md:pt-0 md:pr-0 md:pb-0 md:pl-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div
              onClick={handleJoin}
              aria-disabled={isDisabled}
              className={[
                "flex flex-row gap-2 align-middle",
                !isDisabled ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              <p className="min-w-0 truncate text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800 md:max-w-[15ch]">
                {title}
              </p>
              {isConfirmed ? (
                <Chip variant="statedone" icon="/image/ic_check_md.svg">
                  개설확정
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

          <WishButton isWished={isWished} onClick={toggleWish} />
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
                <div className="ml-1 min-w-0 flex-1">
                  <ProgressBar cur={participantCount} max={capacity} />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600 tabular-nums md:ml-3">
                  <span className="text-green-500">{participantCount}</span>/
                  {capacity}
                </span>
              </div>

              <button
                onClick={handleJoin}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                className={[
                  "shrink-0 rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:hidden",
                  isDisabled
                    ? "cursor-not-allowed border-0 bg-slate-100 text-slate-500"
                    : "cursor-pointer border-1 border-green-500 text-green-500",
                ].join(" ")}
              >
                참여하기
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={[
              "hidden rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:block md:self-end",
              "transition-colors duration-200",
              isDisabled
                ? "cursor-not-allowed border-0 bg-slate-100 text-slate-500"
                : "cursor-pointer border-1 border-green-500 text-green-500 hover:bg-green-100",
            ].join(" ")}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
