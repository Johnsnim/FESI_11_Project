export type GatheringType =
  | "DALLAEMFIT"
  | "OFFICE_STRETCHING"
  | "MINDFULNESS"
  | "WORKATION";

export type GatheringSortBy =
  | "dateTime"
  | "registrationEnd"
  | "participantCount";

export type SortOrder = "asc" | "desc";

export interface GatheringListParams {
  id?: string | number[];
  type?: GatheringType;
  location?: string;
  date?: string;
  createdBy?: number;
  sortBy?: GatheringSortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

export interface JoinedListParams {
  completed?: boolean;
  reviewed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
  sortOrder?: SortOrder;
}
const toQueryString = (params?: object) => {
  if (!params) return "";
  const sp = new URLSearchParams();

  Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;

    if (k === "id" && Array.isArray(v)) {
      sp.set("id", (v as Array<string | number>).join(","));
    } else {
      sp.set(k, String(v));
    }
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
};

export const GATHERING_API = {
  list: (teamId: string, params?: GatheringListParams) =>
    `/${teamId}/gatherings${toQueryString(params)}`,

  create: (teamId: string) => `/${teamId}/gatherings`,

  detail: (teamId: string, id: number) => `/${teamId}/gatherings/${id}`,
  participants: (
    teamId: string,
    id: number,
    params?: {
      limit?: number;
      offset?: number;
      sortBy?: "joinedAt";
      sortOrder?: SortOrder;
    },
  ) => `/${teamId}/gatherings/${id}/participants${toQueryString(params)}`,
  cancel: (teamId: string, id: number) => `/${teamId}/gatherings/${id}/cancel`,
  join: (teamId: string, id: number) => `/${teamId}/gatherings/${id}/join`,
  leave: (teamId: string, id: number) => `/${teamId}/gatherings/${id}/leave`,

  joined: (teamId: string, params?: JoinedListParams) =>
    `/${teamId}/gatherings/joined${toQueryString(params)}`,
};
