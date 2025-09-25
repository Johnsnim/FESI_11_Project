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
