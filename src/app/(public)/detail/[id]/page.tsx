"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/shared/services/review/review.service";
import { detailService } from "@/shared/services/detail/detail.service";

import type { GatheringDetail, ReviewResponse } from "./types";
import GatheringImage from "./components/gatheringimage";
import GatheringInfo from "./components/gatheringinfo";
import Participants from "./components/participants";
import ReviewList from "./components/reviewlist";

function formatDateDots(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
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

  return (
    <div className="px-4 py-6">
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
          <section className="flex flex-col gap-6 md:w-full md:flex-row">
            <GatheringImage data={data} />
            <div className="flex-1">
              <GatheringInfo data={data} />
              <Participants data={data} />
            </div>
          </section>

          <ReviewList
            reviewResp={reviewResp}
            isReviewLoading={isReviewLoading}
            isReviewError={isReviewError}
            page={page}
            setPage={setPage}
          />

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
