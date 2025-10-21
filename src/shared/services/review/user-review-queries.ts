import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "./review.service";
import { useSession } from "next-auth/react";
import type { CreateReviewRequest, ReviewsParams, ReviewsScoreRequest } from "./review.service";
import { gatheringKeys } from "../gathering/use-gathering-queries";

// Query Keys
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params?: ReviewsParams) => [...reviewKeys.lists(), params] as const,
  user: (userId?: number, params?: Omit<ReviewsParams, "userId">) =>
    [...reviewKeys.all, "user", userId, params] as const,
};

export const reviewScoreKeys = {
  all: ["reviewScores"] as const,
  list: (params?: Partial<ReviewsScoreRequest>) =>
    [...reviewScoreKeys.all, params] as const,
};
// 모든 리뷰 목록 조회
export function useReviewsQuery(params?: ReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => reviewService.getReviews(params),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
}

// 내 리뷰 목록 조회
export function useMyReviewsQuery(params?: Omit<ReviewsParams, "userId">) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: reviewKeys.user(Number(userId), params),
    queryFn: () => reviewService.getUserReviews(Number(userId), params),
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
}

// 리뷰 작성
export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (payload: CreateReviewRequest) =>
      reviewService.createReview(accessToken!, payload),
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

export function useReviewScoresQuery(params?: Partial<ReviewsScoreRequest>) {
  return useQuery({
    queryKey: reviewScoreKeys.list(params),
    queryFn: () => reviewService.getReviewScores(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}