"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/shared/services/review/review.service";
import { Chip } from "@/shared/components/chip";
import { Tag } from "@/shared/components/tag";
import { detailService } from "@/shared/services/detail/detail.service";

type GatheringDetail = {
  teamId: number;
  id: number;
  type: string;
  name: string;
  dateTime: string;
  registrationEnd: string;
  location: string;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt: string | null;
};

type ReviewItem = {
  teamId: number;
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: {
    teamId: number;
    id: number;
    type: string;
    name: string;
    dateTime: string;
    location: string;
    image: string | null;
  };
  User: {
    teamId: number;
    id: number;
    name: string;
    image: string | null;
  };
};

type ReviewResponse = {
  data: ReviewItem[];
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
};

function formatDateDots(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
function RatingHearts({
  value = 0,
  max = 5,
}: {
  value?: number;
  max?: number;
}) {
  const USED_MAX = Math.min(max ?? 5, 5);
  const filled = Math.max(0, Math.min(Math.floor(value ?? 0), USED_MAX));

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`평점 ${filled}/${USED_MAX}`}
    >
      {Array.from({ length: USED_MAX }, (_, i) => (
        <img
          key={i}
          src={
            i < filled
              ? "/image/ic_heart_fill.svg"
              : "/image/ic_heart_empty.svg"
          }
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default function DetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const idNum = Number(params?.id);

  const { data, isLoading, isError, error, refetch } =
    useQuery<GatheringDetail>({
      queryKey: ["gathering-detail", idNum],
      queryFn: () => detailService.get(idNum),
      enabled: Number.isFinite(idNum),
    });

  const [page, setPage] = React.useState(1);
  const LIMIT = 10;
  const offset = (page - 1) * LIMIT;

  const {
    data: reviewResp,
    isLoading: isReviewLoading,
    isError: isReviewError,
    refetch: refetchReviews,
  } = useQuery<ReviewResponse>({
    queryKey: ["reviews", idNum, page, LIMIT],
    queryFn: () =>
      reviewService.list({
        gatheringId: idNum,
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: LIMIT,
        offset,
      }),
    enabled: Number.isFinite(idNum),
    placeholderData: (prev) => prev,
  });

  const { dateLabel, timeLabel, tagText, ratioPct, joinDisabled, avatars } =
    React.useMemo(() => {
      if (!data) {
        return {
          dateLabel: "",
          timeLabel: "",
          tagText: "",
          ratioPct: 0,
          joinDisabled: true,
          avatars: [] as string[],
        };
      }
      const start = new Date(data.dateTime);
      const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
      const timeLabel = start
        .toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/^0/, "");

      const now = new Date();
      const regEnd = data.registrationEnd
        ? new Date(data.registrationEnd)
        : null;
      const isToday =
        !!regEnd &&
        now.getFullYear() === regEnd.getFullYear() &&
        now.getMonth() === regEnd.getMonth() &&
        now.getDate() === regEnd.getDate();

      const regEndTime = regEnd
        ? regEnd
            .toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(/^0/, "")
        : null;

      const tagText = regEndTime
        ? `${isToday ? "오늘 " : ""}${regEndTime} 마감`
        : "마감일 미정";

      const ratioPct =
        data.capacity > 0
          ? Math.round((data.participantCount / data.capacity) * 100)
          : 0;

      const disabledByCancel = !!data.canceledAt;
      const disabledByEnd = data.registrationEnd
        ? new Date(data.registrationEnd).getTime() < Date.now()
        : false;
      const joinDisabled = disabledByCancel || disabledByEnd;

      const avatars = Array.from({
        length: Math.min(data.participantCount, 3),
      }).map((_, i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${i + 1}`);

      return { dateLabel, timeLabel, tagText, ratioPct, joinDisabled, avatars };
    }, [data]);

  const reviews = reviewResp?.data ?? [];
  const totalPages = reviewResp?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-[360px,1fr]">
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 md:h-[300px]" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 md:h-[300px]" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border p-6">
          <p className="mb-3 text-base font-medium">불러오기에 실패했어요.</p>
          <p className="text-sm text-zinc-500">
            {(error as Error)?.message ?? "알 수 없는 오류"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-white hover:bg-zinc-800"
          >
            다시 시도
          </button>
        </div>
      )}

      {data && (
        <>
          <section className="grid gap-6 md:grid-cols-[360px,1fr]">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={data.image || "/placeholder-image.jpg"}
                alt={data.name}
                className="h-full max-h-[300px] w-full object-cover"
              />
            </div>

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

              <div className="mb-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                <p className="text-md mt-1.5 leading-7 font-medium tracking-[-0.03em] text-gray-400">
                  위치
                  <span className="pl-2 text-gray-500">{data.location}</span>
                </p>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100">
                  <img
                    src="/image/ic_heart_empty.svg"
                    alt="heart button"
                    className="h-6 w-6"
                  />
                </div>

                <button
                  disabled={joinDisabled}
                  className={`ml-auto inline-flex h-10 w-66 items-center justify-center rounded-xl px-5 text-white ${
                    joinDisabled
                      ? "cursor-not-allowed bg-zinc-300"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  참여하기
                </button>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-[#DEF8EA] to-[#e5f9f8] p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      <span className="font-medium text-emerald-700">
                        {data.participantCount}
                      </span>
                      명 참여
                    </p>
                  </div>

                  <div className="flex -space-x-2">
                    {avatars.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="참여자"
                        className="h-7 w-7 rounded-full ring-2 ring-white"
                      />
                    ))}
                    {data.participantCount > 3 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium ring-2 ring-white">
                        +{data.participantCount - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row">
                    <img src="/image/ic_check_sm.svg" />
                    <p className="font-medium text-green-600">개설확정</p>
                  </div>
                </div>

                <div className="mt-4 mb-2 flex items-center justify-between text-xs text-gray-500">
                  <span>최소 {data.capacity}명</span>
                  <span>{data.participantCount}명 참여</span>
                </div>
                <div className="p-0.1 w-full rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0]">
                  <div
                    className="h-2 rounded-full transition-[width]"
                    style={{ width: `${ratioPct}%` }}
                    aria-valuenow={ratioPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">리뷰 모아보기</h2>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
              {isReviewLoading && (
                <div className="py-10 text-center text-sm text-zinc-500">
                  리뷰를 불러오는 중…
                </div>
              )}

              {!isReviewLoading && !isReviewError && reviews.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <p>리뷰가 없습니다.</p>
                </div>
              )}

              {!isReviewLoading && !isReviewError && reviews.length > 0 && (
                <div className="divide-y">
                  {reviews.map((rv) => (
                    <article key={rv.id} className="py-4">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              rv.User.image ||
                              "https://api.dicebear.com/9.x/thumbs/svg?seed=user"
                            }
                            className="h-8 w-8 rounded-full"
                            alt="아바타"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{rv.User.name}</div>
                            <div className="text-xs text-zinc-500">
                              {formatDateDots(rv.createdAt)}
                            </div>
                          </div>
                        </div>
                        <RatingHearts value={rv.score} />
                      </div>
                      <p className="mt-2 text-sm text-zinc-700">{rv.comment}</p>
                    </article>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                    disabled={page <= 1}
                  >
                    이전
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm ${
                          p === page
                            ? "bg-green-100 text-green-600"
                            : "hover:bg-zinc-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
                    disabled={page >= totalPages}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="mt-2 text-xs text-zinc-500">
            {data.canceledAt
              ? "이 모임은 취소되었습니다."
              : `모집 마감: ${formatDateDots(data.registrationEnd)}`}
          </div>
        </>
      )}
    </div>
  );
}
