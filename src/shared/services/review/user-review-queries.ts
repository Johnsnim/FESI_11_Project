import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "./review.service";
import { useSession } from "next-auth/react";
import type {
  CreateReviewRequest,
  ReviewsParams,
  ReviewsScoreRequest,
} from "./review.service";
import { gatheringKeys } from "../gathering/use-gathering-queries";

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

export function useReviewsQuery(params?: ReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => reviewService.getReviews(params),
    retry: false,
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

export function useReviewScoresQuery(params?: Partial<ReviewsScoreRequest>) {
  return useQuery({
    queryKey: reviewScoreKeys.list(params),
    queryFn: () => reviewService.getReviewScores(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
