"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/pagination";
import { cn } from "@/shadcn/lib/utils";

function visiblePages(current: number) {
  const windowSize = 0;
  const start = Math.max(1, current - windowSize);
  const end = current + windowSize;
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export function PaginationBar({
  page,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: {
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (next: number) => void;
}) {
  const pages = visiblePages(page);

  return (
    <Pagination className="mt-6 flex justify-center">
      <PaginationContent className="gap-6 md:gap-12">
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!hasPrevPage}
            onClick={() => hasPrevPage && onPageChange(page - 1)}
            className={cn(
              "border-0 bg-transparent text-gray-300 hover:bg-transparent hover:text-gray-400",
              hasPrevPage && "text-gray-500 hover:text-gray-700",
            )}
          />
        </PaginationItem>

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => onPageChange(p)}
              isActive={p === page}
              className={cn(
                "h-12 w-12 rounded-3xl border-0 bg-transparent text-xl leading-none text-gray-400 hover:text-gray-600",
                "flex items-center justify-center",
                p === page && "bg-green-100 text-green-600",
              )}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {hasNextPage && (
          <PaginationItem>
            <PaginationEllipsis className="text-gray-300" />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!hasNextPage}
            onClick={() => hasNextPage && onPageChange(page + 1)}
            className={cn(
              "border-0 bg-transparent hover:bg-transparent",
              hasNextPage ? "text-slate-900" : "text-gray-300",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
