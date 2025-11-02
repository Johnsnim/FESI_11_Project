"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
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
import { useCallback, useState, useMemo, memo } from "react";

const REVIEWS_LIMIT = 10;

// 🎯 리뷰 섹션은 스크롤해야 보이므로 lazy loading
const ReviewList = dynamic(() => import("@/shared/components/review-list"), {
  loading: () => <ReviewListSkeleton />,
  ssr: false,
});

const ReviewPagination = dynamic(
  () => import("@/shared/components/pagination"),
  { ssr: false }
);

// 스켈레톤 컴포넌트들
const GatheringSkeleton = memo(() => (
  <div className="grid gap-6 md:grid-cols-[360px,1fr]">
    <div className="h-64 animate-pulse rounded-2xl bg-zinc-200 md:h-[300px]" />
    <div className="space-y-4">
      <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
      <div className="h-32 animate-pulse rounded-2xl bg-zinc-200" />
    </div>
  </div>
));
GatheringSkeleton.displayName = "GatheringSkeleton";

const ReviewListSkeleton = memo(() => (
  <div className="mt-6 space-y-4 rounded-3xl bg-white p-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="h-16 animate-pulse rounded bg-zinc-200" />
      </div>
    ))}
  </div>
));
ReviewListSkeleton.displayName = "ReviewListSkeleton";

// 날짜 포맷 함수 메모이제이션
const formatDateDots = (iso: string | null | undefined): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

function DetailContent() {
  const params = useParams<{ id: string }>();
  const idNum = useMemo(() => Number(params?.id), [params?.id]);

  // 리뷰 페이지네이션 상태
  const [reviewPage, setReviewPage] = useState(1);
  const reviewOffset = useMemo(
    () => (reviewPage - 1) * REVIEWS_LIMIT,
    [reviewPage]
  );

  // ============= 데이터 조회 =============
  // 모임 상세 정보
  const { data: gatheringData, isLoading: isGatheringLoading } =
    useGatheringDetailQuery(idNum);

  // 내가 참여한 모임 목록 (최적화: 전체 조회 대신 현재 모임만 확인)
  const { data: myJoined = [] } = useJoinedGatheringsQuery({
    limit: 20, // 100 -> 20으로 줄임
    offset: 0,
  });
  
  // 참여 여부 메모이제이션
  const isJoined = useMemo(
    () => myJoined.some((g) => g.id === idNum),
    [myJoined, idNum]
  );

  // 참여하기/취소하기 mutation
  const joinMut = useJoinGatheringMutation(idNum);
  const leaveMut = useLeaveGatheringMutation();

  // 리뷰 목록 (페이지 변경 시에만 재조회)
  const { data: reviewResp, isLoading: isReviewLoading } =
    useGatheringReviewsQuery({
      gatheringId: idNum,
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: REVIEWS_LIMIT,
      offset: reviewOffset,
    });

  // ============= 핸들러 함수 메모이제이션 =============
  const handleJoin = useCallback(() => {
    if (joinMut.isPending) return;
    joinMut.mutate();
  }, [joinMut]);

  const handleLeave = useCallback(() => {
    if (leaveMut.isPending) return;
    leaveMut.mutate(idNum);
  }, [leaveMut, idNum]);

  const handlePageChange = useCallback((page: number) => {
    setReviewPage(page);
    // 리뷰 섹션으로 스크롤
    window.scrollTo({ top: 800, behavior: "smooth" });
  }, []);

  // 모집 마감 정보 메모이제이션
  const deadlineText = useMemo(() => {
    if (!gatheringData) return "";
    if (gatheringData.canceledAt) return "이 모임은 취소되었습니다.";
    return `모집 마감: ${formatDateDots(gatheringData.registrationEnd)}`;
  }, [gatheringData]);

  // ============= 렌더링 =============
  if (isGatheringLoading) {
    return (
      <div className="mb-10 px-4 py-2 md:px-6 md:py-8 lg:p-0 lg:pt-14">
        <GatheringSkeleton />
      </div>
    );
  }

  if (!gatheringData) {
    return (
      <div className="mb-10 px-4 py-2 md:px-6 md:py-8 lg:p-0 lg:pt-14">
        <div className="flex h-64 items-center justify-center text-zinc-500">
          모임을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 px-4 py-2 md:px-6 md:py-8 lg:p-0 lg:pt-14">
      {/* 모임 정보 */}
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

      {/* 리뷰 섹션 (lazy loaded) */}
      <ReviewList
        reviews={reviewResp?.data ?? []}
        isLoading={isReviewLoading}
        variant="detail"
      />

      {/* 리뷰 페이지네이션 */}
      {reviewResp && reviewResp.totalPages > 1 && (
        <ReviewPagination
          currentPage={reviewPage}
          totalPages={reviewResp.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 모집 마감 정보 */}
      <div className="mt-2 text-xs text-zinc-500">{deadlineText}</div>
    </div>
  );
}

export default function DetailPage() {
  return <DetailContent />;
}