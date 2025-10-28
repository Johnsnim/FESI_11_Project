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

export type SortBy = "createdAt" | "score" | "participantCount";
export type SortOrder = "asc" | "desc";

// API 응답 타입
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

// 리뷰 목록 조회 파라미터
export interface ReviewsParams {
  gatheringId?: number;
  userId?: number;
  type?: GatheringType;
  location?: Location;
  date?: string; // YYYY-MM-DD
  registrationEnd?: string; // YYYY-MM-DD
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

// 리뷰 작성 요청
export interface CreateReviewRequest {
  gatheringId: number;
  score: number;
  comment: string;
}

// 리뷰 작성 응답
export interface CreateReviewResponse {
  teamId: number;
  id: number;
  userId: number;
  gatheringId: number;
  score: number;
  comment: string;
  createdAt: string;
}

// 리뷰 평점 조회 파라미터
export interface ReviewScoresParams {
  gatheringId?: string; // 쉼표로 구분된 모임 ID 목록 (예: "1,2,3")
  type?: GatheringType;
}

// 리뷰 평점 응답
export interface ReviewScoreResponse {
  teamId: number;
  gatheringId?: number; // gatheringId 파라미터가 있을 경우에만 포함
  type?: GatheringType; // type 파라미터가 있을 경우에만 포함
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
  averageScore: number;
}

// 쿼리 스트링 빌더
function buildQueryString(params?: ReviewsParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const reviewService = {
  // 리뷰 목록 조회 (레거시 지원)
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
    return this.getReviews({ ...params, userId });
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

  // 리뷰 평점 목록 조회
  async getReviewScores(
    params?: ReviewScoresParams,
  ): Promise<ReviewScoreResponse[]> {
    const searchParams = new URLSearchParams();

    if (params?.gatheringId) {
      searchParams.append("gatheringId", params.gatheringId);
    }
    if (params?.type) {
      searchParams.append("type", params.type);
    }

    const queryString = searchParams.toString();
    const { data } = await api.get<ReviewScoreResponse[]>(
      `/${TEAM_ID}/reviews/scores${queryString ? `?${queryString}` : ""}`,
    );
    return data;
  },
};

// Backward compatibility exports
export const getReviews = reviewService.getReviews.bind(reviewService);
export const getUserReviews = reviewService.getUserReviews.bind(reviewService);
export const createReview = reviewService.createReview.bind(reviewService);
export const getReviewScores = reviewService.getReviewScores.bind(reviewService);