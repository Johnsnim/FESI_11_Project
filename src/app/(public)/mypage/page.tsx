"use client";

import Info from "@/features/mypage/components/info";
import JoinedGatherings from "@/features/mypage/components/Joined-Gatherings";
import MyPageTabs, { TabItem } from "@/features/mypage/components/mypage-tabs";
import UserEditModal from "@/features/mypage/components/user-edit-modal";
import {
  EditUserFormValues,
  EditUserSchema,
} from "@/features/mypage/schemas/edituser.schema";
import {
  useUpdateUserMutation,
  useUserQuery,
} from "@/shared/services/auth/use-auth-queries";
import {
  useJoinedGatheringsQuery,
  useLeaveGatheringMutation,
} from "@/shared/services/gathering/use-gathering-queries";
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
  const leaveGathering = useLeaveGatheringMutation();

  const { data: joinedGatherings, isLoading: isJoinedLoading } =
    useJoinedGatheringsQuery();

  //훅폼 , 모달 훅
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

  //모임 참여취소 훅
  const handleCancelGathering = (id: number) => {
    if (confirm("정말 이 모임 참여를 취소하시겠습니까?")) {
      leaveGathering.mutate(id);
    }
  };

  //탭 훅
  const currentTab = searchParams.get("tab") ?? "meetings";

  const handleTabChange = (tab: string) => {
    router.push(`/mypage?tab=${tab}`);
  };

  const tabs: TabItem[] = [
    { value: "joinedgatherings", label: "나의 모임" },
    { value: "reviews", label: "나의 리뷰" },
    { value: "created", label: "내가 만든 모임" },
  ];
  ///여기까지

  if (isLoading) return <div className="p-4">로딩중...</div>;

  return (
    <div className="lg-gap-10 flex w-full flex-col gap-6 px-4 md:px-6 lg:flex-row">
      {user && (
        <Info
          user={user}
          isModalOpen={() => {
            setModalOpen(true);
          }}
        />
      )}
      <div className="mb-10 w-full">
        <MyPageTabs
          currentTab={currentTab}
          tabs={tabs}
          onChange={handleTabChange}
        />

        <div className="mt-6 lg:mt-8">
          {currentTab === "joinedgatherings" && (
            <JoinedGatherings
              data={joinedGatherings}
              isLoading={isJoinedLoading}
              onCancel={handleCancelGathering}
            />
          )}
          {currentTab === "reviews" && <div />}
          {currentTab === "created" && <div />}
        </div>
      </div>
      <UserEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        isLoading={updateUser.isPending}
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
