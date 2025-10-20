import React from "react";
import type { ReviewItem } from "../../../app/(public)/detail/[id]/types";
import RatingHearts from "./ratings";
import Image from "next/image";

function formatDateDots(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default function ReviewItem({ rv }: { rv: ReviewItem }) {
  return (
    <article className="py-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              rv.User.image ||
              "https://api.dicebear.com/9.x/thumbs/svg?seed=user"
            }
            className="h-8 w-8 rounded-full"
            alt="아바타"
          />
          <div className="text-sm">
            <div className="mb-1.5 font-medium text-slate-600">
              {rv.User.name}
            </div>

            <div className="flex flex-row gap-2 text-xs text-slate-500">
              <RatingHearts value={rv.score} />
              {formatDateDots(rv.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-base font-medium text-gray-700">{rv.comment}</p>
    </article>
  );
}
