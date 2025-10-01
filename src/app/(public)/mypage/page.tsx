"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MyPageTabs, { TabItem } from "@/features/mypage/components/mypage-tabs";
import Info from "@/features/mypage/components/info";
import { useUserQuery } from "@/shared/services/auth/use-auth-queries";

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useUserQuery();

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
      {user && <Info user={user} />}
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
    </div>
  );
}
