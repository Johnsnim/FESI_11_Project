import { api } from "@/lib/api/api";
import { REVIEWS_API, type ReviewListParams } from "./endpoints";

export type ReviewResponse = {
  data: Array<{
    teamId: number;
    id: number;
    score: number;
    comment: string;
    createdAt: string;
    Gathering: {
      teamId: number;
      id: number;
      type: string;
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
  }>;
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
};

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID as string;

export const reviewService = {
  async list(params?: ReviewListParams) {
    const { data } = await api.get<ReviewResponse>(
      REVIEWS_API.list(TEAM_ID, params),
    );
    return data;
  },
};

export type GatheringType =
  | "DALLAEMFIT"
  | "OFFICE_STRETCHING"
  | "MINDFULNESS"
  | "WORKATION";
export type Location = "건대입구" | "을지로3가" | "신림" | "홍대입구";

export interface Review {
  teamId: string; // number에서 string으로 수정
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: {
    teamId: string; // number에서 string으로 수정
    id: number;
    type: string;
    name: string;
    dateTime: string;
    location: string;
    image: string;
  };
  User: {
    teamId: string; // number에서 string으로 수정
    id: number;
    name: string;
    image: string;
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
// 리뷰 목록 조회
export async function getReviews(
  params?: ReviewsParams,
): Promise<ReviewsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.gatheringId !== undefined) {
    searchParams.append("gatheringId", String(params.gatheringId));
  }
  if (params?.userId !== undefined) {
    searchParams.append("userId", String(params.userId));
  }
  if (params?.type) {
    searchParams.append("type", params.type);
  }
  if (params?.location) {
    searchParams.append("location", params.location);
  }
  if (params?.date) {
    searchParams.append("date", params.date);
  }
  if (params?.registrationEnd) {
    searchParams.append("registrationEnd", params.registrationEnd);
  }
  if (params?.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }
  if (params?.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }
  if (params?.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }
  if (params?.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  const url = `/${TEAM_ID}/reviews${queryString ? `?${queryString}` : ""}`;

  const { data } = await api.get<ReviewsResponse>(url);

  return data;
}

// 특정 사용자의 리뷰 목록 조회
export async function getUserReviews(
  userId: number,
  params?: Omit<ReviewsParams, "userId">,
): Promise<ReviewsResponse> {
  const searchParams = new URLSearchParams();

  searchParams.append("userId", String(userId));

  if (params?.gatheringId !== undefined) {
    searchParams.append("gatheringId", String(params.gatheringId));
  }
  if (params?.type) {
    searchParams.append("type", params.type);
  }
  if (params?.location) {
    searchParams.append("location", params.location);
  }
  if (params?.date) {
    searchParams.append("date", params.date);
  }
  if (params?.registrationEnd) {
    searchParams.append("registrationEnd", params.registrationEnd);
  }
  if (params?.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }
  if (params?.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }
  if (params?.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }
  if (params?.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  const queryString = searchParams.toString();
  const url = `/${TEAM_ID}/reviews?${queryString}`;

  const { data } = await api.get<ReviewsResponse>(url);

  return data;
}
