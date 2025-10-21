import { api } from "@/lib/api/api";
import { ReviewListParams, REVIEWS_API } from "./endpoints";
import { ReviewResponse } from "@/app/(public)/detail/[id]/types";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID as string;

export type GatheringType =
  | "DALLAEMFIT"
  | "OFFICE_STRETCHING"
  | "MINDFULNESS"
  | "WORKATION";

export type Location = "건대입구" | "을지로3가" | "신림" | "홍대입구";

export interface Review {
  teamId: number;
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: {
    teamId: number;
    id: number;
    type: GatheringType;
    name: string;
    dateTime: string;
    location: string;
    image: string | null;
  };
  User: {
    teamId: number;
    id: number;
    name: string;
    image: string | null;
  };
}

export interface ReviewsResponse {
  data: Review[];
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ReviewsParams {
  gatheringId?: number;
  userId?: number;
  type?: GatheringType;
  location?: Location;
  date?: string; // YYYY-MM-DD
  registrationEnd?: string; // YYYY-MM-DD
  sortBy?: "createdAt" | "score" | "participantCount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface CreateReviewRequest {
  gatheringId: number;
  score: number;
  comment: string;
}

export interface CreateReviewResponse {
  teamId: number;
  id: number;
  userId: number;
  gatheringId: number;
  score: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsScoreRequest {
  teamId: number;
  gatheringId: number;
  type: GatheringType;
}

export interface ReviewsScoreResponse {
  teamId: number;
  gatheringId?: number;
  type?: GatheringType;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
  averageScore: number;
}

function buildQueryString(params?: ReviewsParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.gatheringId !== undefined) {
    searchParams.append("gatheringId", String(params.gatheringId));
  }
  if (params.userId !== undefined) {
    searchParams.append("userId", String(params.userId));
  }
  if (params.type) {
    searchParams.append("type", params.type);
  }
  if (params.location) {
    searchParams.append("location", params.location);
  }
  if (params.date) {
    searchParams.append("date", params.date);
  }
  if (params.registrationEnd) {
    searchParams.append("registrationEnd", params.registrationEnd);
  }
  if (params.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }
  if (params.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }
  if (params.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }
  if (params.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const reviewService = {
    async list(params?: ReviewListParams) {
    const { data } = await api.get<ReviewResponse>(
      REVIEWS_API.list(TEAM_ID, params),
    );
    return data;
  },
  // 리뷰 목록 조회
  async getReviews(params?: ReviewsParams): Promise<ReviewsResponse> {
    const queryString = buildQueryString(params);
    const { data } = await api.get<ReviewsResponse>(
      `/${TEAM_ID}/reviews${queryString}`,
    );
    return data;
  },

  // 특정 사용자의 리뷰 목록 조회
  async getUserReviews(
    userId: number,
    params?: Omit<ReviewsParams, "userId">,
  ): Promise<ReviewsResponse> {
    const mergedParams = { ...params, userId };
    return this.getReviews(mergedParams);
  },

  // 리뷰 작성
  async createReview(
    accessToken: string,
    payload: CreateReviewRequest,
  ): Promise<CreateReviewResponse> {
    const { data } = await api.post<CreateReviewResponse>(
      `/${TEAM_ID}/reviews`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  },

  async getReviewScores(
    params?: Partial<ReviewsScoreRequest>,
  ): Promise<ReviewsScoreResponse[]> {
    const searchParams = new URLSearchParams();

    if (params?.gatheringId) {
      searchParams.append("gatheringId", String(params.gatheringId));
    }
    if (params?.type) {
      searchParams.append("type", params.type);
    }

    const queryString = searchParams.toString();
    const { data } = await api.get<ReviewsScoreResponse[]>(
      `/${TEAM_ID}/reviews/scores${queryString ? `?${queryString}` : ""}`,
    );
    return data;
  },
};

//

// Backward compatibility exports
export const getReviews = reviewService.getReviews.bind(reviewService);
export const getUserReviews = reviewService.getUserReviews.bind(reviewService);
export const createReview = reviewService.createReview.bind(reviewService);
export const getReviewScores = reviewService.getReviewScores.bind(reviewService)