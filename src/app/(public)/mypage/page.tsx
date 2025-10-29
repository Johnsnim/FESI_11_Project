"use client";

import { CreatedGatherings } from "@/features/mypage/components/created-Gatherings";
import Info from "@/features/mypage/components/info";
import JoinedGatherings from "@/features/mypage/components/Joined-Gatherings";
import PageTabs, { TabItem } from "@/shared/components/pagetabs";
import MyReviews from "@/features/mypage/components/myreviews";
import UserEditModal from "@/features/mypage/components/user-edit-modal";
import {
  EditUserFormValues,
  EditUserSchema,
} from "@/features/mypage/schemas/edituser.schema";
import CreateReviewModal from "@/features/reviews/components/create-review-modal";
import {
  CreateReviewFormValues,
  CreateReviewSchema,
} from "@/features/reviews/schemas/review.schema";
import { Button } from "@/shadcn/button";
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
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";


function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useUserQuery();
  const updateUser = useUpdateUserMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSubTab, setReviewSubTab] = useState<"writable" | "written">(
    "writable",
  );

  const leaveGathering = useLeaveGatheringMutation();

  const createReview = useCreateReviewMutation();

  const { data: joinedGatherings, isLoading: isJoinedLoading } =
    useJoinedGatheringsQuery();

  const { data: createdGatherings, isLoading: isCreatedLoading } =
    useCreatedGatheringsQuery();

  const { data: myReviews, isLoading: isReviewsLoading } = useMyReviewsQuery({
    limit: 10,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  //유저수정 폼
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    mode: "onChange",
    values: user
      ? {
          name: user.name ?? "",
          email: user.email ?? "",
          companyName: user.companyName ?? "",
          image: user.image ?? undefined,
        }
      : undefined,
  });

  const handleSubmit = (values: EditUserFormValues) => {
    updateUser.mutate(values, {
      onSuccess: () => {
        alert("수정 성공!");
        setModalOpen(false);
      },
    });
  };

  //리뷰작성폼
  const reviewForm = useForm<CreateReviewFormValues>({
    resolver: zodResolver(CreateReviewSchema),
    mode: "onChange",
    defaultValues: { score: 0, comment: "", gatheringId: undefined },
  });

  // 리뷰 작성 핸들러
  const handleReviewSubmit = (
    values: CreateReviewFormValues & { gatheringId?: number },
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
      },
    );
  };

  // 리뷰 작성 버튼 클릭 핸들러
  const handleWriteReview = (gatheringId: number) => {
    reviewForm.setValue("gatheringId", gatheringId, { shouldValidate: true });
    setReviewModalOpen(true);
  };
  //모임 참여취소 훅
  const handleCancelGathering = (id: number) => {
    if (confirm("정말 이 모임 참여를 취소하시겠습니까?")) {
      leaveGathering.mutate(id);
    }
  };

  const GotoDetailPage = (id: number) => {
    router.push(`/detail/${id}`);
  };

  //탭 훅
  const currentTab = searchParams.get("tab") ?? "joinedgatherings";

  const handleTabChange = (tab: string) => {
    router.push(`/mypage?tab=${tab}`);
  };

  const tabs: TabItem[] = [
    { value: "joinedgatherings", label: "나의 모임" },
    { value: "reviews", label: "나의 리뷰" },
    { value: "created", label: "내가 만든 모임" },
  ];

  const handleReviewSubTabChange = (tab: "writable" | "written") => {
    setReviewSubTab(tab);
  };
  ///여기까지

  if (isLoading) return <div className="p-4">로딩중...</div>;

  return (
    <div className="lg-gap-10 mt-5.5 flex w-full flex-col gap-6 px-4 md:mt-8 md:px-6 lg:mt-15.5 lg:flex-row">
      {user && (
        <Info
          user={user}
          isModalOpen={() => {
            setModalOpen(true);
          }}
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
              gotoDetailPage={GotoDetailPage}
            />
          )}
          {currentTab === "reviews" && (
            <div>
              {/* 서브탭 */}
              <div className="mb-4 flex gap-2.5 md:mb-8 lg:mb-4.5">
                <Button
                  onClick={() => handleReviewSubTabChange("writable")}
                  className={`h-10 cursor-pointer rounded-2xl px-4 py-2 text-base font-semibold ${
                    reviewSubTab === "writable"
                      ? "bg-[#333333] text-white"
                      : "bg-[#eeeeee] text-[#333333]"
                  }`}
                >
                  작성 가능한 리뷰
                </Button>
                <Button
                  onClick={() => handleReviewSubTabChange("written")}
                  className={`h-10 cursor-pointer rounded-2xl px-4 py-2 text-base font-semibold ${
                    reviewSubTab === "written"
                      ? "bg-[#333333] text-white"
                      : "bg-[#eeeeee] text-[#333333]"
                  }`}
                >
                  작성한 리뷰
                </Button>
              </div>

              {/* 서브탭별 내용 */}
              {reviewSubTab === "writable" ? (
                <JoinedGatherings
                  data={joinedGatherings?.filter(
                    (g) => g.isCompleted && !g.isReviewed,
                  )}
                  isLoading={isJoinedLoading}
                  onWriteReview={handleWriteReview}
                  gotoDetailPage={GotoDetailPage}
                />
              ) : (
                <MyReviews data={myReviews} isLoading={isReviewsLoading} />
              )}
            </div>
          )}
          {currentTab === "created" && (
            <CreatedGatherings
              data={createdGatherings}
              isLoading={isCreatedLoading}
              gotoDetailPage={GotoDetailPage}
            />
          )}
        </div>
      </div>

      <UserEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        isLoading={updateUser.isPending}
      />
      {/* 리뷰 작성 모달 */}    
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
    </div>
  );
}

// Suspense로 감싸기위함
export default function MyPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩중...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
