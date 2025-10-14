"use client";
import { ButtonPlus } from "@/shared/components/btnPlus";
import Banner from "../../../features/list/components/banner";
import Category from "../../../features/list/components/category";

import { useState } from "react";
import { CreateGatheringModal } from "@/shared/components/modals";
import ProfileModal from "@/features/profilemodal";

import { ProfileModalForm } from "@/features/profilemodal/types";
import RatingModal from "@/features/ratingmodal";
import { RatingModalForm } from "@/features/ratingmodal/types";

const defaults: ProfileModalForm = {
  name: "홍길동",
  companyName: "사명",
  email: "test@naver.com",
  imageFile: null,
  imagePreviewUrl: null,
};

export default function ListPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="absolute overflow-x-hidden">
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />

      <Category />
      <ButtonPlus onClick={() => setModalOpen(true)} aria-label="모임 만들기" />

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
