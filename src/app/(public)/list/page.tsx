"use client";
import { ButtonPlus } from "@/shared/components/btnPlus";
import Banner from "../../../features/list/components/banner";
import Category from "../../../features/list/components/category";
import Card from "@/shared/components/card";

export default function ListPage() {
  return (
    <div className="absolute overflow-x-hidden">
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />

      <Category />

      <ButtonPlus />
    </div>
  );
}
