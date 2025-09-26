import React from "react";
import type { ReviewItem } from "../types";
import RatingHearts from "./ratings";

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
            <div className="font-medium">{rv.User.name}</div>
            <div className="text-xs text-zinc-500">
              {formatDateDots(rv.createdAt)}
            </div>
          </div>
        </div>
        <RatingHearts value={rv.score} />
      </div>
      <p className="mt-2 text-sm text-zinc-700">{rv.comment}</p>
    </article>
  );
}
