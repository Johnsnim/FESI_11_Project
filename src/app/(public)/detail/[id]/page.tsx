"use client";

import { useParams } from "next/navigation";
import {
  useGatheringDetailQuery,
  useJoinedGatheringsQuery,
  useJoinGatheringMutation,
  useLeaveGatheringMutation,
} from "@/shared/services/gathering/use-gathering-queries";
import { useGatheringReviewsQuery } from "@/shared/services/review/user-review-queries";
import GatheringImage from "@/features/detail/components/gatheringimage";
import GatheringInfo from "@/features/detail/components/gatheringinfo";
import Participants from "@/features/detail/components/participants";
import ReviewList from "@/shared/components/review-list";
import ReviewPagination from "@/shared/components/pagination";
import { useCallback, useState } from "react";

const REVIEWS_LIMIT = 10;

function formatDateDots(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function DetailContent() {
  const params = useParams<{ id: string }>();
  const idNum = Number(params?.id);

  // ============= 데이터 조회 =============
  // 모임 상세 정보
  const { data: gatheringData, isLoading: isGatheringLoading } =
    useGatheringDetailQuery(idNum);

  // 내가 참여한 모임 목록
  const { data: myJoined = [] } = useJoinedGatheringsQuery({
    limit: 100,
    offset: 0,
  });
  const isJoined = !!myJoined.find((g) => g.id === idNum);

  // 참여하기/취소하기 mutation
  const joinMut = useJoinGatheringMutation(idNum);
  const leaveMut = useLeaveGatheringMutation();

  // 리뷰 페이지네이션 상태
  const [reviewPage, setReviewPage] = useState(1);
  const reviewOffset = (reviewPage - 1) * REVIEWS_LIMIT;

  // 리뷰 목록
  const {
    data: reviewResp,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useGatheringReviewsQuery({
    gatheringId: idNum,
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: REVIEWS_LIMIT,
    offset: reviewOffset,
  });

  // ============= 핸들러 함수 =============
  const handleJoin = useCallback(() => {
    joinMut.mutate();
  }, [joinMut]);

  const handleLeave = useCallback(() => {
    leaveMut.mutate(idNum);
  }, [leaveMut, idNum]);

  const handlePageChange = useCallback((page: number) => {
    setReviewPage(page);
  }, []);

  // ============= 렌더링 =============
  return (
    <div className="mb-10 px-4 py-2 md:px-6 md:py-8 lg:p-0 lg:pt-14">
      {/* 로딩 상태 */}
      {isGatheringLoading && (
        <div className="grid gap-6 md:grid-cols-[360px,1fr]">
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 md:h-[300px]" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 md:h-[300px]" />
        </div>
      )}

      {/* 모임 정보 */}
      {gatheringData && (
        <>
          <section className="flex flex-col gap-6 md:w-full md:flex-row">
            <GatheringImage data={gatheringData} />
            <div className="flex-1">
              <GatheringInfo
                data={gatheringData}
                isJoined={isJoined}
                onJoin={handleJoin}
                onLeave={handleLeave}
                joining={joinMut.isPending}
                leaving={leaveMut.isPending}
              />
              <Participants data={gatheringData} />
            </div>
          </section>

          {/* 리뷰 목록 */}
          <ReviewList
            reviews={reviewResp?.data ?? []}
            isLoading={isReviewLoading}
            variant="detail"
          />

          {/* 리뷰 페이지네이션 */}
          {reviewResp && (
            <ReviewPagination
              currentPage={reviewPage}
              totalPages={reviewResp.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* 모집 마감 정보 */}
          <div className="mt-2 text-xs text-zinc-500">
            {gatheringData.canceledAt
              ? "이 모임은 취소되었습니다."
              : `모집 마감: ${formatDateDots(gatheringData.registrationEnd)}`}
          </div>
        </>
      )}
    </div>
  );
}

export default function DetailPage() {
  return <DetailContent />;
}
