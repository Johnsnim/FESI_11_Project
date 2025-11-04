"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Tag } from "@/shared/components/tag";
import { Chip } from "@/shared/components/chip";
import { gatheringService } from "@/shared/services/gathering/gathering.service";
import type { Gathering } from "@/shared/services/gathering/gathering.service";
import WishButton from "@/shared/components/wish-button";
import { alert, confirm } from "@/shared/store/alert-store";

type Props = {
  data: Gathering;
  isJoined: boolean;
  isWished: boolean;
  onWishToggle: () => void;
  onJoin: () => void; // 내부에서 가드만 하고 호출
  onLeave: () => void; // 내부에서 그대로 호출
  joining?: boolean;
  leaving?: boolean;
};

type SessionUserWithId =
  | (NonNullable<ReturnType<typeof useSession>["data"]>["user"] & {
      id?: number | string;
    })
  | undefined;

function getUserId(u: SessionUserWithId): number | null {
  const raw = u?.id;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export default function GatheringInfo({
  data,
  isJoined,
  isWished,
  onWishToggle,
  onJoin,
  onLeave,
  joining = false,
  leaving = false,
}: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const myId = getUserId(session?.user as SessionUserWithId);
  const isMadeByMe = myId !== null && data.createdBy === myId;

  const queryClient = useQueryClient();
  const [canceling, setCanceling] = useState(false);

  const [locallyCanceled, setLocallyCanceled] = useState(false);

  const now = Date.now();
  const { dateLabel, timeLabel, tagText, joinDisabled } = useMemo(() => {
    const start = new Date(data.dateTime);
    const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
    const timeLabel = start
      .toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/^0/, "");

    const regEnd = data.registrationEnd ? new Date(data.registrationEnd) : null;
    const isCanceledNow = !!data.canceledAt || locallyCanceled;
    const isRegClosed = regEnd ? regEnd.getTime() < now : false;
    const isEventPast = start.getTime() < now;

    const joinDisabled = isCanceledNow || isRegClosed || isEventPast;

    let tagText: string;
    if (isCanceledNow) {
      tagText = "취소됨";
    } else if (isRegClosed) {
      tagText = "모집 마감";
    } else if (regEnd) {
      const isToday = new Date().toDateString() === regEnd.toDateString();
      const regEndTime = regEnd
        .toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/^0/, "");
      tagText = `${isToday ? "오늘 " : ""}${regEndTime} 마감`;
    } else {
      tagText = "마감일 미정";
    }

    return { dateLabel, timeLabel, tagText, joinDisabled };
  }, [data, locallyCanceled, now]);

  function getErrorMessage(err: unknown): string {
    const e = err as {
      response?: { data?: { message?: string } };
      message?: string;
    } | null;
    return (
      e?.response?.data?.message || e?.message || "모임 취소에 실패했습니다."
    );
  }

  async function handleCancel() {
    if (canceling) return;
    if (!isMadeByMe) return;

    confirm(
      "정말로 이 모임을 취소하시겠어요?\n취소 후에는 되돌릴 수 없어요.",
      async () => {
        try {
          setCanceling(true);

          await gatheringService.cancel(data.id);

          setLocallyCanceled(true);

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["gathering-detail", data.id],
            }),
            queryClient.invalidateQueries({ queryKey: ["gathering-list"] }),
            queryClient.invalidateQueries({ queryKey: ["joined-list"] }),
            queryClient.invalidateQueries({ queryKey: ["wish-list"] }),
          ]);

          router.refresh();

          alert("모임을 취소했습니다.");
        } catch (err: unknown) {
          alert(getErrorMessage(err));
        } finally {
          setCanceling(false);
        }
      },
    );
  }

  function handleJoinClick() {
    if (status !== "authenticated") {
      confirm("로그인이 필요한 서비스입니다.", () => {
        router.push("/login");
      });
      return;
    }

    if (joinDisabled) {
      alert(
        locallyCanceled || data.canceledAt
          ? "취소된 모임입니다."
          : "모집이 마감되었거나 이미 시작/종료된 모임입니다.",
      );
      return;
    }

    onJoin();
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tag variant="md" icon="/image/ic_alarm.svg">
          {tagText}
        </Tag>
        <Chip variant="infomd">{dateLabel}</Chip>
        <Chip variant="infomd">{timeLabel}</Chip>
      </div>

      <h1 className="mb-4 text-xl leading-tight font-bold md:text-2xl">
        {data.name}
      </h1>

      <p className="text-md mt-1.5 mb-4 leading-7 font-medium tracking-[-0.03em] text-gray-400">
        위치 <span className="pl-2 text-gray-500">{data.location}</span>
      </p>

      <div className="flex items-center gap-1">
        <WishButton isWished={isWished} onClick={onWishToggle} />

        {isMadeByMe ? (
          <div className="flex h-full w-full gap-2 pl-2">
            <button
              disabled={joinDisabled || canceling}
              onClick={handleCancel}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-transparent px-5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {canceling ? "취소 중..." : "취소하기"}
            </button>

            <button
              disabled={joinDisabled}
              className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-white ${
                joinDisabled
                  ? "cursor-not-allowed bg-zinc-300"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("현재 페이지 링크가 클립보드에 복사되었습니다.");
                } catch {
                  alert("링크 복사에 실패했습니다.");
                }
              }}
            >
              공유하기
            </button>
          </div>
        ) : isJoined ? (
          <button
            disabled={leaving}
            onClick={onLeave}
            className="ml-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-green-500 bg-transparent px-5 font-semibold text-green-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {leaving ? "취소 중..." : "참여 취소하기"}
          </button>
        ) : (
          <button
            disabled={joinDisabled || joining}
            onClick={handleJoinClick}
            className={`ml-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl px-5 text-white ${
              joinDisabled || joining
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {joining ? "참여 중..." : "참여하기"}
          </button>
        )}
      </div>
    </div>
  );
}
