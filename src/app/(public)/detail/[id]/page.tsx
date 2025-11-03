"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import {
  useGatheringDetailQuery,
  useJoinGatheringMutation,
  useLeaveGatheringMutation,
  useGatheringParticipantsQuery,
} from "@/shared/services/gathering/use-gathering-queries";
import { useGatheringReviewsQuery } from "@/shared/services/review/user-review-queries";
import { useWishlist } from "@/shared/hooks/use-wishlist";
import GatheringImage from "@/features/detail/components/gatheringimage";
import GatheringInfo from "@/features/detail/components/gatheringinfo";
import Participants from "@/features/detail/components/participants";
import { useCallback, useState, useMemo, memo, useEffect } from "react";

const REVIEWS_LIMIT = 10;

const ReviewList = dynamic(() => import("@/shared/components/review-list"), {
  loading: () => <ReviewListSkeleton />,
  ssr: false,
});

const ReviewPagination = dynamic(
  () => import("@/shared/components/pagination"),
  { ssr: false }
);

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

  console.log("=" .repeat(80));
  console.log("🔵 DetailContent 렌더링 시작, gatheringId:", idNum);

  // 세션 정보
  const { data: session } = useSession();
  const myUserId = useMemo(() => {
    const rawId = session?.user?.id;
    let id = null;
    if (typeof rawId === "number") id = rawId;
    else if (typeof rawId === "string") id = Number(rawId);
    
    console.log("👤 내 사용자 ID:", id);
    return id;
  }, [session?.user?.id]);

  const [reviewPage, setReviewPage] = useState(1);
  const reviewOffset = useMemo(
    () => (reviewPage - 1) * REVIEWS_LIMIT,
    [reviewPage]
  );

  // 모임 상세 정보
  const { data: gatheringData, isLoading: isGatheringLoading } =
    useGatheringDetailQuery(idNum);

  useEffect(() => {
    if (gatheringData) {
      console.log("📊 모임 상세 정보:", {
        id: gatheringData.id,
        name: gatheringData.name,
        participantCount: gatheringData.participantCount,
      });
    }
  }, [gatheringData]);

  // 참가자 목록
  const { 
    data: participants = [], 
    isLoading: isParticipantsLoading,
    isFetching: isParticipantsFetching,
    dataUpdatedAt: participantsUpdatedAt,
  } = useGatheringParticipantsQuery(idNum, {
    limit: 100,
    sortBy: "joinedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    console.log("👥 Participants 상태:", {
      isLoading: isParticipantsLoading,
      isFetching: isParticipantsFetching,
      count: participants.length,
      userIds: participants.map(p => p.userId),
      updatedAt: new Date(participantsUpdatedAt).toLocaleTimeString(),
    });
  }, [participants, isParticipantsLoading, isParticipantsFetching, participantsUpdatedAt]);

  // 참여 여부 계산
  const isJoined = useMemo(() => {
    if (!myUserId) {
      console.log("⚠️ myUserId가 없음, isJoined = false");
      return false;
    }
    
    const result = participants.some((p) => p.userId === myUserId);
    
    console.log("🎯 isJoined 계산:", {
      myUserId,
      participantUserIds: participants.map(p => p.userId),
      found: result,
      result,
    });
    
    return result;
  }, [participants, myUserId]);

  // isJoined 변경 추적
  useEffect(() => {
    console.log("⚡ isJoined 값:", isJoined, "(변경됨)");
  }, [isJoined]);

  // 찜하기 상태
  const { isWished, toggleWish } = useWishlist(idNum);

  // Mutations
  const joinMut = useJoinGatheringMutation(idNum);
  const leaveMut = useLeaveGatheringMutation();

  // Mutation 상태 추적
  useEffect(() => {
    console.log("🔄 Mutation 상태:", {
      joining: joinMut.isPending,
      leaving: leaveMut.isPending,
    });
  }, [joinMut.isPending, leaveMut.isPending]);

  // 리뷰 목록
  const { data: reviewResp, isLoading: isReviewLoading } =
    useGatheringReviewsQuery({
      gatheringId: idNum,
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: REVIEWS_LIMIT,
      offset: reviewOffset,
    });

  const handleJoin = useCallback(() => {
    if (joinMut.isPending) return;
    console.log("👆 참여하기 버튼 클릭됨");
    joinMut.mutate();
  }, [joinMut]);

  const handleLeave = useCallback(() => {
    if (leaveMut.isPending) return;
    console.log("👆 참여 취소하기 버튼 클릭됨");
    leaveMut.mutate(idNum);
  }, [leaveMut, idNum]);

  const handleWishToggle = useCallback(() => {
    toggleWish();
  }, [toggleWish]);

  const handlePageChange = useCallback((page: number) => {
    setReviewPage(page);
    window.scrollTo({ top: 800, behavior: "smooth" });
  }, []);

  const deadlineText = useMemo(() => {
    if (!gatheringData) return "";
    if (gatheringData.canceledAt) return "이 모임은 취소되었습니다.";
    return `모집 마감: ${formatDateDots(gatheringData.registrationEnd)}`;
  }, [gatheringData]);

  console.log("🎨 렌더링 준비 완료:", {
    isJoined,
    participantCount: gatheringData?.participantCount,
    participantsLength: participants.length,
  });
  console.log("=" .repeat(80));

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
      <section className="flex flex-col gap-6 md:w-full md:flex-row">
        <GatheringImage data={gatheringData} />
        <div className="flex-1">
          <GatheringInfo
            data={gatheringData}
            isJoined={isJoined}
            isWished={isWished}
            onWishToggle={handleWishToggle}
            onJoin={handleJoin}
            onLeave={handleLeave}
            joining={joinMut.isPending}
            leaving={leaveMut.isPending}
          />
          <Participants
            data={gatheringData}
            participants={participants.slice(0, 12)}
            isLoading={isParticipantsLoading}
          />
        </div>
      </section>

      <ReviewList
        reviews={reviewResp?.data ?? []}
        isLoading={isReviewLoading}
        variant="detail"
      />

      {reviewResp && reviewResp.totalPages > 1 && (
        <ReviewPagination
          currentPage={reviewPage}
          totalPages={reviewResp.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <div className="mt-2 text-xs text-zinc-500">{deadlineText}</div>
    </div>
  );
}

export default function DetailPage() {
  return <DetailContent />;
}