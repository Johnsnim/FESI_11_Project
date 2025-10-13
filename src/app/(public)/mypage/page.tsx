"use client";

import Info from "@/features/mypage/components/info";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useUserQuery();
  const updateUser = useUpdateUserMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      companyName: user?.companyName ?? "",
      image: user?.image ?? undefined,
    },
  });

  const handleSubmit = (values: EditUserFormValues) => {
    updateUser.mutate(values, {
      onSuccess: () => {
        alert("수정 성공!");
        setModalOpen(false);
      },
    });
  };

  const currentTab = searchParams.get("tab") ?? "meetings";

  const handleTabChange = (tab: string) => {
    router.push(`/mypage?tab=${tab}`);
  };

  // 탭 정보 배열
  const tabs: TabItem[] = [
    { value: "meetings", label: "나의 모임" },
    { value: "reviews", label: "나의 리뷰" },
    { value: "created", label: "내가 만든 모임" },
  ];
  if (isLoading) return <div className="p-4">로딩중...</div>;

  return (
    <div className="flex w-full flex-col px-4 md:px-6 lg:flex-row">
      {user && <Info user={user} isModalOpen={()=>{setModalOpen(true)}}/>}
      {/* 탭 UI */}
      <div className="w-full">
        <MyPageTabs
          currentTab={currentTab}
          tabs={tabs}
          onChange={handleTabChange}
        />

        {/* 탭별 내용 */}
        <div className="mt-6">
          {currentTab === "meetings" && <div />}
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
