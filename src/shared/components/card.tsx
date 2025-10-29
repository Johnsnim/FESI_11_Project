"use client";

import { useRouter } from "next/navigation";
import { Chip } from "./chip";
import { Tag } from "./tag";
import { motion } from "motion/react";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

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

type WishMap = Record<string, number[]>;

function hasId(u: unknown): u is { id: string | number } {
  if (typeof u !== "object" || u === null) return false;
  if (!("id" in u)) return false;
  const id = (u as Record<string, unknown>).id;
  return typeof id === "string" || typeof id === "number";
}

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
  const { data: session } = useSession();

  const rawUser: unknown = session?.user;
  const userId = hasId(rawUser) ? String(rawUser.id) : "";

  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsWished(false);
      return;
    }
    try {
      const raw = localStorage.getItem("wishlist");
      const map: WishMap = raw ? JSON.parse(raw) : {};
      setIsWished(!!map[userId]?.includes(id));
    } catch {
      setIsWished(false);
    }
  }, [userId, id]);

  const toggleWish = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!userId) {
        alert("로그인이 필요한 서비스입니다");
        router.push("/login");
        return;
      }
      try {
        const raw = localStorage.getItem("wishlist");
        const map: WishMap = raw ? JSON.parse(raw) : {};
        const set = new Set<number>(map[userId] ?? []);
        if (set.has(id)) {
          set.delete(id);
          setIsWished(false);
        } else {
          set.add(id);
          setIsWished(true);
        }
        map[userId] = Array.from(set);
        localStorage.setItem("wishlist", JSON.stringify(map));
      } catch {
        /* noop */
      }
    },
    [userId, id, router],
  );

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

  const isClosed = !!(isCanceled || (regEnd && regEnd < now));
  const statusText = isCanceled ? "취소됨" : isClosed ? "마감" : "개설확정";

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
  }, [regEnd]);

  function handleJoin() {
    if (isClosed) return;
    router.push(`/detail/${id}`);
  }

  return (
    <div className="mx-4 mb-5 box-border w-[calc(100%-2rem)] justify-center overflow-hidden rounded-3xl bg-white md:mx-0 md:flex md:h-fit md:w-full md:flex-row md:items-center md:justify-center md:p-6">
      <div
        onClick={handleJoin}
        aria-disabled={isClosed}
        className={[
          "relative flex h-39 w-full items-center justify-center rounded-t-3xl md:aspect-square md:size-45 md:shrink-0 md:rounded-3xl md:rounded-l-3xl",
          image ? "bg-[#EDEDED]" : "bg-[#9DEBCD]",
          isClosed ? "cursor-default" : "cursor-pointer",
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

        {isClosed && (
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
              aria-disabled={isClosed}
              className={[
                "flex flex-row gap-2 align-middle",
                !isClosed ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              <p className="min-w-0 truncate text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800 md:max-w-[15ch]">
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

          <button
            type="button"
            onClick={toggleWish}
            aria-pressed={isWished}
            aria-label={isWished ? "찜 취소" : "찜하기"}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100 transition-colors duration-200 hover:bg-gray-50"
          >
            <img
              src={
                isWished ? "/image/ic_heart_fill.svg" : "/image/ic_heart.svg"
              }
              alt="찜하기 버튼"
              className="h-6 w-6"
            />
          </button>
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
                    className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0]"
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
                onClick={handleJoin}
                disabled={isClosed}
                aria-disabled={isClosed}
                className={[
                  "shrink-0 rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:hidden",
                  isClosed
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
            disabled={isClosed}
            aria-disabled={isClosed}
            className={[
              "hidden rounded-2xl px-6 py-2.5 font-semibold whitespace-nowrap md:block md:self-end",
              "transition-colors duration-200",
              isClosed
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
