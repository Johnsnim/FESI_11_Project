"use client";
import { ButtonPlus } from "@/shared/components/btnPlus";
import Banner from "../../../features/list/components/banner";
import Category from "../../../features/list/components/category";
import CreateGatheringModal from "@/features/createmodal";
import { useState } from "react";

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
