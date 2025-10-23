"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { CreateGatheringModal } from "@/shared/components/modals";
import ProfileModal from "@/features/profilemodal";

import { ProfileModalForm } from "@/features/profilemodal/types";
import RatingModal from "@/features/ratingmodal";
import { RatingModalForm } from "@/features/ratingmodal/types";
import Banner from "@/features/main/components/banner";
import Category from "@/features/main/components/category";
import ButtonPlus from "@/shared/components/btnPlus";

const defaults: ProfileModalForm = {
  name: "홍길동",
  companyName: "사명",
  email: "test@naver.com",
  imageFile: null,
  imagePreviewUrl: null,
};

export default function ListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  const handleCreateClick = () => {
    if (status !== "authenticated") {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="absolute w-full overflow-x-hidden md:px-5 lg:mx-5 lg:mt-10 lg:w-fit lg:px-0">
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />

      <Category />
      <ButtonPlus onClick={handleCreateClick} aria-label="모임 만들기" />

      <CreateGatheringModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={(data) => {
          console.log("모임 생성 데이터", data);
        }}
      />
    </div>
  );
}
