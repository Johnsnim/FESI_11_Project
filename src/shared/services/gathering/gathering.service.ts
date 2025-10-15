import { api } from "@/lib/api/api";
import { GATHERING_API, GatheringListParams, GatheringType } from "./endpoints";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID as string;

export interface Gathering {
  teamId: number;
  id: number;
  type: GatheringType;
  name: string;
  dateTime: string;
  registrationEnd: string | null;
  location: string;
  participantCount: number;
  capacity: number;
  image: string | null;
  createdBy: number;
  canceledAt?: string | null;
}

export interface CreateGatheringRequest {
  type: GatheringType;
  name: string;
  location: string;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  imageFile?: File | null;
}

export class GatheringService {
  async list(params?: GatheringListParams): Promise<Gathering[]> {
    const { data } = await api.get<Gathering[]>(
      GATHERING_API.list(TEAM_ID, params),
    );
    return data ?? [];
  }

  async create(payload: CreateGatheringRequest): Promise<Gathering> {
    const formData = new FormData();
    formData.append("type", payload.type);
    formData.append("name", payload.name);
    formData.append("location", payload.location);
    formData.append("dateTime", payload.dateTime);
    formData.append("registrationEnd", payload.registrationEnd);
    formData.append("capacity", String(payload.capacity));

    if (payload.imageFile) {
      formData.append("image", payload.imageFile, payload.imageFile.name);
    }

    const { data } = await api.post<Gathering>(
      GATHERING_API.create(TEAM_ID),
      formData,
    );

    return data;
  }
}

export const gatheringService = new GatheringService();

export type ALLGATHERINGTYPES = "DALLAEMFIT" | "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";

export interface JoinedGathering {
  teamId: number;
  id: number;
  type: ALLGATHERINGTYPES;
  name: string;
  dateTime: string;
  registrationEnd: string;
  location: string;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt: string | null;
  joinedAt: string;
  isCompleted: boolean;
  isReviewed: boolean;
}

export interface JoinedGatheringsParams {
  completed?: boolean;
  reviewed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
  sortOrder?: "asc" | "desc";
}
export async function getJoinedGatherings(
  accessToken: string,
  params?: JoinedGatheringsParams
): Promise<JoinedGathering[]> {
  const searchParams = new URLSearchParams();

  if (params?.completed !== undefined) {
    searchParams.append("completed", String(params.completed));
  }
  if (params?.reviewed !== undefined) {
    searchParams.append("reviewed", String(params.reviewed));
  }
  if (params?.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }
  if (params?.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }
  if (params?.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }
  if (params?.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }

  const queryString = searchParams.toString();
  const url = `/${TEAM_ID}/gatherings/joined${queryString ? `?${queryString}` : ""}`;

  const { data } = await api.get<JoinedGathering[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}