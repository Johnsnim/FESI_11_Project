import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviews, getUserReviews } from "./review.service";
import { useSession } from "next-auth/react";
import type { CreateReviewRequest, ReviewsParams } from "./review.service";
import { gatheringKeys } from "../gathering/use-gathering-queries";

// Query Keys
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params?: ReviewsParams) => [...reviewKeys.lists(), params] as const,
  user: (userId?: number, params?: Omit<ReviewsParams, "userId">) =>
    [...reviewKeys.all, "user", userId, params] as const,
};

// 모든 리뷰 목록 조회
export function useReviewsQuery(params?: ReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => getReviews(params),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 내 리뷰 목록 조회 (useSession에서 직접 userId 가져오기)
export function useMyReviewsQuery(params?: Omit<ReviewsParams, "userId">) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: reviewKeys.user(Number(userId), params),
    queryFn: () => getUserReviews(Number(userId), params),
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (payload: CreateReviewRequest) =>
      createReview(accessToken!, payload),
    onSuccess: () => {
      // 내 리뷰 목록 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: reviewKeys.user(Number(userId)),
      });
      // 전체 리뷰 목록도 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
      // 참여한 모임 목록도 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.joined(),
      });
    },
  });
}
