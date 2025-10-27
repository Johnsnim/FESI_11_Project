import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "./review.service";
import { useSession } from "next-auth/react";
import type { 
  CreateReviewRequest, 
  ReviewsParams, 
  ReviewScoresParams 
} from "./review.service";
import { gatheringKeys } from "../gathering/use-gathering-queries";

// Query Keys - 통합된 구조
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params?: ReviewsParams) => [...reviewKeys.lists(), params] as const,
  user: (userId?: number, params?: Omit<ReviewsParams, "userId">) =>
    [...reviewKeys.all, "user", userId, params] as const,
  scores: () => [...reviewKeys.all, "scores"] as const,
  score: (params?: ReviewScoresParams) => [...reviewKeys.scores(), params] as const,
};

// 리뷰 목록 조회

export function useReviewsQuery(params?: ReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => reviewService.getReviews(params),
    retry: false,
    staleTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGatheringReviewsQuery(params: ReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => reviewService.getReviews(params),
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function useMyReviewsQuery(params?: Omit<ReviewsParams, "userId">) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: reviewKeys.user(Number(userId), params),
    queryFn: () => reviewService.getUserReviews(Number(userId), params),
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
  });
}

// 리뷰 평점 조회
export function useReviewScoresQuery(params?: ReviewScoresParams) {
  return useQuery({
    queryKey: reviewKeys.score(params),
    queryFn: () => reviewService.getReviewScores(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;
  return useMutation({
    mutationFn: (payload: CreateReviewRequest) =>
      reviewService.createReview(accessToken!, payload),
    onSuccess: (data) => {
      // 1. 내 리뷰 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: reviewKeys.user(Number(userId)),
      });

      // 2. 전체 리뷰 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });

      // 3. 해당 모임의 리뷰 평점 invalidate
      queryClient.invalidateQueries({
        queryKey: reviewKeys.score({ gatheringId: String(data.gatheringId) }),
      });

      // 4. 전체 리뷰 평점 invalidate (type별 평균 등)
      queryClient.invalidateQueries({
        queryKey: reviewKeys.scores(),
      });

      // 5. 참여한 모임 목록 invalidate (리뷰 작성 상태 반영)
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.joined(),
      });
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: reviewKeys.user(Number(userId)),
        }),
        queryClient.invalidateQueries({ queryKey: reviewKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: gatheringKeys.joined() }),
      ]);
    },
  });
}

export function useInfiniteReviewsQuery(params?: Omit<ReviewsParams, "offset" | "limit">) {
  return useInfiniteQuery({
    queryKey: reviewKeys.list({ ...params, limit: 10 }),
    queryFn: ({ pageParam = 0 }) =>
      reviewService.getReviews({
        ...params,
        limit: 10,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = (allPages.length - 1) * 10;
      const hasMore = currentOffset + lastPage.data.length < lastPage.totalItemCount;
      return hasMore ? currentOffset + 10 : undefined;
    },
    initialPageParam: 0,
  });
}
