"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import GatheringImage from "@/features/detail/components/gatheringimage";
import GatheringInfo from "@/features/detail/components/gatheringinfo";
import Participants from "@/features/detail/components/participants";
import ReviewList from "@/features/detail/components/reviewlist";

import { useGatheringReviewsQuery } from "@/shared/services/review/user-review-queries";
import {
  useGatheringDetailQuery,
  useJoinedGatheringsQuery,
  useJoinGatheringMutation,
  useLeaveGatheringMutation,
} from "@/shared/services/gathering/use-gathering-queries"

function formatDateDots(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const idNum = Number(params?.id);

  const { data, isLoading, isError, error, refetch } =
    useGatheringDetailQuery(idNum);

  const { data: myJoined = [] } = useJoinedGatheringsQuery({
    limit: 100,
    offset: 0,
  });
  const isJoined = !!myJoined.find((g) => g.id === idNum);

  const joinMut = useJoinGatheringMutation(idNum);
  const leaveMut = useLeaveGatheringMutation();

  const [page, setPage] = React.useState(1);
  const LIMIT = 10;
  const offset = (page - 1) * LIMIT;

  const {
    data: reviewResp,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useGatheringReviewsQuery({
    gatheringId: idNum,
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: LIMIT,
    offset,
  });

  return (
    <div className="mb-10 px-4 py-2 md:px-6 md:py-8 lg:p-0 lg:pt-14">
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
              <GatheringInfo
                data={data}
                isJoined={isJoined}
                onJoin={() => joinMut.mutate()}
                onLeave={() => leaveMut.mutate(idNum)}
                joining={joinMut.isPending}
                leaving={leaveMut.isPending}
              />
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
