"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo, useCallback, memo } from "react";
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

// 🎯 날짜 포맷팅 함수를 컴포넌트 외부로 분리
function formatDate(dateTimeISO: string) {
  const start = new Date(dateTimeISO);
  const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
  const timeLabel = start
    .toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/^0/, "");

  return { dateLabel, timeLabel };
}

// 🎯 마감 라벨 계산 함수를 컴포넌트 외부로 분리
function calculateDeadlineLabel(
  registrationEndISO: string | null | undefined,
): string | null {
  if (!registrationEndISO) return "마감일 미정";

  const regEnd = new Date(registrationEndISO);
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
    return `오늘 ${regEnd.getHours()}시 마감`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    regEnd.getFullYear() === tomorrow.getFullYear() &&
    regEnd.getMonth() === tomorrow.getMonth() &&
    regEnd.getDate() === tomorrow.getDate();

  if (isTomorrow) {
    return `내일 ${regEnd.getHours()}시 마감`;
  }

  return `${regEnd.getHours()}시 마감`;
}

// 🎯 상태 계산 함수를 컴포넌트 외부로 분리
function calculateCardState(
  registrationEndISO: string | null | undefined,
  isCanceled: boolean | undefined,
  capacity: number,
  participantCount: number,
) {
  const now = new Date();
  const regEnd = registrationEndISO ? new Date(registrationEndISO) : null;
  const isRecruitmentClosed = !!regEnd && regEnd.getTime() <= now.getTime();
  const isDisabled = !!isCanceled || isRecruitmentClosed;
  const isConfirmed =
    !isCanceled && capacity > 0 && participantCount >= capacity;

  return { isRecruitmentClosed, isDisabled, isConfirmed };
}

// 🎯 Card 컴포넌트 메모이제이션
const Card = memo(function Card({
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

  // 날짜 포맷팅 메모이제이션
  const { dateLabel, timeLabel } = useMemo(
    () => formatDate(dateTimeISO),
    [dateTimeISO],
  );

  // 상태 계산 메모이제이션
  const { isRecruitmentClosed, isDisabled, isConfirmed } = useMemo(
    () =>
      calculateCardState(
        registrationEndISO,
        isCanceled,
        capacity,
        participantCount,
      ),
    [registrationEndISO, isCanceled, capacity, participantCount],
  );

  // 마감 라벨 메모이제이션
  const tagLabel = useMemo(
    () => calculateDeadlineLabel(registrationEndISO),
    [registrationEndISO],
  );

  // handleJoin 메모이제이션
  const handleJoin = useCallback(() => {
    if (isDisabled) return;
    router.push(`/detail/${id}`);
  }, [isDisabled, router, id]);

  // 클래스명 메모이제이션
  const imageContainerClass = useMemo(
    () =>
      [
        "relative flex h-39 w-full items-center justify-center rounded-t-3xl md:aspect-square md:size-45 md:shrink-0 md:rounded-3xl md:rounded-l-3xl",
        image ? "bg-[#EDEDED]" : "bg-[#9DEBCD]",
        isDisabled ? "cursor-default" : "cursor-pointer",
      ].join(" "),
    [image, isDisabled],
  );

  const titleContainerClass = useMemo(
    () =>
      [
        "flex flex-row gap-2 align-middle",
        !isDisabled ? "cursor-pointer" : "cursor-default",
      ].join(" "),
    [isDisabled],
  );

  const mobileButtonClass = useMemo(
    () =>
      [
        "shrink-0 rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:hidden",
        isDisabled
          ? "cursor-not-allowed border-0 bg-slate-100 text-slate-500"
          : "cursor-pointer border-1 border-green-500 text-green-500",
      ].join(" "),
    [isDisabled],
  );

  const desktopButtonClass = useMemo(
    () =>
      [
        "hidden rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:block md:self-end",
        "transition-colors duration-200",
        isDisabled
          ? "cursor-not-allowed border-0 bg-slate-100 text-slate-500"
          : "cursor-pointer border-1 border-green-500 text-green-500 hover:bg-green-100",
      ].join(" "),
    [isDisabled],
  );

  return (
    <div className="box-border w-[calc(100%-2rem)] justify-center overflow-hidden rounded-3xl bg-white md:flex md:h-fit md:w-full md:flex-row md:items-center md:justify-center md:p-6">
      <div
        onClick={handleJoin}
        aria-disabled={isDisabled}
        className={imageContainerClass}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 180px"
            className="rounded-t-3xl object-cover md:rounded-3xl md:rounded-l-3xl"
            loading="lazy"
            quality={50}
          />
        ) : (
          <Image
            src="/image/img_banner_lg.svg"
            alt="배너"
            width={320}
            height={156}
            className="absolute right-0 bottom-0 max-h-full w-[90%] object-contain"
            quality={50}
            priority={false}
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
              className={titleContainerClass}
            >
              <p className="min-w-0 truncate text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800 md:max-w-[15ch]">
                {title}
              </p>
              {isConfirmed && (
                <Chip variant="statedone" icon="/image/ic_check_md.svg">
                  개설확정
                </Chip>
              )}
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
                <Image
                  src="/image/ic_person.svg"
                  alt="person icon"
                  width={18}
                  height={18}
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
                className={mobileButtonClass}
              >
                참여하기
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={desktopButtonClass}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
});

export default Card;
