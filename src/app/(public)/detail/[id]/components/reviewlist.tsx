import React from "react";
import type { ReviewResponse } from "../types";
import ReviewItem from "./reviewitem";

export default function ReviewList({
  reviewResp,
  isReviewLoading,
  isReviewError,
  page,
  setPage,
}: {
  reviewResp?: ReviewResponse;
  isReviewLoading: boolean;
  isReviewError: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const reviews = reviewResp?.data ?? [];
  const totalPages = reviewResp?.totalPages ?? 1;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">리뷰 모아보기</h2>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
        {isReviewLoading && (
          <div className="py-10 text-center text-sm text-zinc-500">
            리뷰를 불러오는 중…
          </div>
        )}

        {!isReviewLoading && !isReviewError && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <p>리뷰가 없습니다.</p>
          </div>
        )}

        {!isReviewLoading && !isReviewError && reviews.length > 0 && (
          <div className="divide-y">
            {reviews.map((rv) => (
              <ReviewItem key={rv.id} rv={rv} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
              disabled={page <= 1}
            >
              이전
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm ${
                    p === page
                      ? "bg-green-100 text-green-600"
                      : "hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
              disabled={page >= totalPages}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
