"use client";

import dynamic from "next/dynamic";
import { Button } from "@/shadcn/button";
import PageTabs, { TabItem } from "@/shared/components/pagetabs";
import Info from "@/features/mypage/components/info";
import JoinedGatherings from "@/features/mypage/components/Joined-Gatherings";
import ReviewList from "@/shared/components/review-list";
import {
  useUpdateUserMutation,
  useUserQuery,
} from "@/shared/services/auth/use-auth-queries";
import {
  useCreatedGatheringsQuery,
  useJoinedGatheringsQuery,
  useLeaveGatheringMutation,
} from "@/shared/services/gathering/use-gathering-queries";
import {
  useCreateReviewMutation,
  useMyReviewsQuery,
} from "@/shared/services/review/user-review-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback, useMemo, memo } from "react";
import { useForm } from "react-hook-form";
import {
  EditUserFormValues,
  EditUserSchema,
} from "@/features/mypage/schemas/edituser.schema";
import {
  CreateReviewFormValues,
  CreateReviewSchema,
} from "@/features/reviews/schemas/review.schema";
import { CreatedGatherings } from "@/features/mypage/components/created-Gatherings";

// 🎯 모달만 dynamic import (실제로 지연 로딩이 필요한 부분)
const UserEditModal = dynamic(
  () => import("@/features/mypage/components/user-edit-modal"),
  { ssr: false }
);

const CreateReviewModal = dynamic(
  () => import("@/features/reviews/components/create-review-modal"),
  { ssr: false }
);

// 서브탭 버튼 컴포넌트 메모이제이션
const SubTabButton = memo(({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) => (
  <Button
    onClick={onClick}
    className={`h-10 cursor-pointer rounded-2xl px-4 py-2 text-base font-semibold ${
      active
        ? "bg-[#333333] text-white"
        : "bg-[#eeeeee] text-[#333333]"
    }`}
  >
    {children}
  </Button>
));
SubTabButton.displayName = "SubTabButton";

function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "joinedgatherings";
  const reviewSubTab = (searchParams.get("reviewTab") ?? "writable") as "writable" | "written";
  
  const { data: user, isLoading } = useUserQuery();
  const updateUser = useUpdateUserMutation();
  const leaveGathering = useLeaveGatheringMutation();
  const createReview = useCreateReviewMutation();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // 데이터 페칭
  const { data: joinedGatherings, isLoading: isJoinedLoading } =
    useJoinedGatheringsQuery();

  const { data: createdGatherings, isLoading: isCreatedLoading } =
    useCreatedGatheringsQuery();

  const { data: myReviews, isLoading: isReviewsLoading } = useMyReviewsQuery({
    limit: 10,
    offset: 0,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  });

  // 필터링된 데이터 메모이제이션
  const writableGatherings = useMemo(
    () => joinedGatherings?.filter(g => g.isCompleted && !g.isReviewed) ?? [],
    [joinedGatherings]
  );

  // 폼 초기화
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    mode: "onChange",
    values: user ? {
      name: user.name ?? "",
      email: user.email ?? "",
      companyName: user.companyName ?? "",
      image: user.image ?? undefined,
    } : undefined,
  });

  const reviewForm = useForm<CreateReviewFormValues>({
    resolver: zodResolver(CreateReviewSchema),
    mode: "onChange",
    defaultValues: { score: 0, comment: "", gatheringId: undefined },
  });

  // 핸들러 메모이제이션
  const handleSubmit = useCallback((values: EditUserFormValues) => {
    updateUser.mutate(values, {
      onSuccess: () => {
        alert("수정 성공!");
        setModalOpen(false);
      },
    });
  }, [updateUser]);

  const handleReviewSubmit = useCallback((
    values: CreateReviewFormValues & { gatheringId?: number }
  ) => {
    if (!values.gatheringId) return;

    createReview.mutate(
      {
        gatheringId: values.gatheringId,
        score: values.score,
        comment: values.comment,
      },
      {
        onSuccess: () => {
          alert("리뷰 작성 완료!");
          setReviewModalOpen(false);
          reviewForm.reset();
        },
        onError: (error) => {
          alert("리뷰 작성 실패: " + error.message);
        },
      }
    );
  }, [createReview, reviewForm]);

  const handleWriteReview = useCallback((gatheringId: number) => {
    reviewForm.setValue("gatheringId", gatheringId, { shouldValidate: true });
    setReviewModalOpen(true);
  }, [reviewForm]);

  const handleCancelGathering = useCallback((id: number) => {
    if (confirm("정말 이 모임 참여를 취소하시겠습니까?")) {
      leaveGathering.mutate(id);
    }
  }, [leaveGathering]);

  const gotoDetailPage = useCallback((id: number) => {
    router.push(`/detail/${id}`);
  }, [router]);

  const handleTabChange = useCallback((tab: string) => {
    router.push(`/mypage?tab=${tab}`);
  }, [router]);

  const handleReviewSubTabChange = useCallback((tab: "writable" | "written") => {
    router.push(`/mypage?tab=reviews&reviewTab=${tab}`);
  }, [router]);

  // 탭 정의 메모이제이션
  const tabs: TabItem[] = useMemo(() => [
    { value: "joinedgatherings", label: "나의 모임" },
    { value: "reviews", label: "나의 리뷰" },
    { value: "created", label: "내가 만든 모임" },
  ], []);

  if (isLoading) {
    return <div className="p-4">로딩중...</div>;
  }

  return (
    <div className="lg-gap-10 mt-5.5 flex w-full flex-col gap-6 px-4 md:mt-8 md:px-6 lg:mt-15.5 lg:flex-row">
      {user && (
        <Info
          user={user}
          isModalOpen={() => setModalOpen(true)}
        />
      )}
      
      <div className="mb-10 w-full">
        <PageTabs
          currentTab={currentTab}
          tabs={tabs}
          onChange={handleTabChange}
          layoutId="mypage"
        />

        <div className="mt-4 mb-4 md:mt-7 md:mb-8 lg:mb-4.5">
          {currentTab === "joinedgatherings" && (
            <JoinedGatherings
              data={joinedGatherings}
              isLoading={isJoinedLoading}
              onCancel={handleCancelGathering}
              onWriteReview={handleWriteReview}
              gotoDetailPage={gotoDetailPage}
            />
          )}
          
          {currentTab === "reviews" && (
            <div>
              <div className="mb-4 flex gap-2.5 md:mb-8 lg:mb-4.5">
                <SubTabButton
                  active={reviewSubTab === "writable"}
                  onClick={() => handleReviewSubTabChange("writable")}
                >
                  작성 가능한 리뷰
                </SubTabButton>
                <SubTabButton
                  active={reviewSubTab === "written"}
                  onClick={() => handleReviewSubTabChange("written")}
                >
                  작성한 리뷰
                </SubTabButton>
              </div>

              {reviewSubTab === "writable" ? (
                <JoinedGatherings
                  data={writableGatherings}
                  isLoading={isJoinedLoading}
                  onWriteReview={handleWriteReview}
                  gotoDetailPage={gotoDetailPage}
                />
              ) : (
                <ReviewList
                  reviews={myReviews?.data ?? []}
                  isLoading={isReviewsLoading}
                />
              )}
            </div>
          )}
          
          {currentTab === "created" && (
            <CreatedGatherings
              data={createdGatherings}
              isLoading={isCreatedLoading}
              gotoDetailPage={gotoDetailPage}
            />
          )}
        </div>
      </div>

      {/* 모달은 조건부 렌더링으로 필요할 때만 로드 */}
      {modalOpen && (
        <UserEditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          form={form}
          onSubmit={handleSubmit}
          isLoading={updateUser.isPending}
        />
      )}
      
      {reviewModalOpen && (
        <CreateReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            reviewForm.reset();
          }}
          form={reviewForm}
          onSubmit={handleReviewSubmit}
          isLoading={createReview.isPending}
        />
      )}
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩중...</div>}>
      <MyPageContent />
    </Suspense>
  );
}