"use client";
import { ButtonPlus } from "@/shared/components/btnPlus";
import Banner from "./components/banner";

export default function ListPage() {
  return (
    <>
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />
      <ButtonPlus />
    </>
  );
}
