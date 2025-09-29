import type {
  GatheringType,
  SortOrder,
} from "@/shared/services/gathering/endpoints";

export type ReviewSortBy = "createdAt" | "score" | "participantCount";

export interface ReviewListParams {
  gatheringId?: number;
  userId?: number;
  type?: GatheringType;
  location?: string;
  date?: string;
  registrationEnd?: string;
  sortBy?: ReviewSortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

const toQueryString = (params?: ReviewListParams) => {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
};

export const REVIEWS_API = {
  list: (teamId: string, params?: ReviewListParams) =>
    `/${teamId}/reviews${toQueryString(params)}`,
};
