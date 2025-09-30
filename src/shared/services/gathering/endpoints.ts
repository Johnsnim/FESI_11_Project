export type GatheringType =
  | "DALLEAMFIT"
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

const toQueryString = (params?: GatheringListParams) => {
  if (!params) return "";
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;

    if (k === "id" && Array.isArray(v)) {
      sp.set("id", v.join(","));
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
};
