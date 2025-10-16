import { api } from "@/lib/api/api";
import {
  GATHERING_API,
  type GatheringListParams,
  type JoinedListParams,
  type GatheringType,
  type SortOrder,
} from "./endpoints";

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

export interface JoinedGathering extends Gathering {
  joinedAt: string;
  isCompleted: boolean;
  isReviewed: boolean;
}

/* ✅ 참가자 타입 export */
export interface GatheringParticipant {
  teamId: number;
  userId: number;
  gatheringId: number;
  joinedAt: string;
  User: {
    id: number;
    email: string;
    name: string;
    companyName: string;
    image: string | null;
  };
}

export class GatheringService {
  async list(params?: GatheringListParams): Promise<Gathering[]> {
    const { data } = await api.get<Gathering[]>(
      GATHERING_API.list(TEAM_ID, params),
    );
    return data ?? [];
  }

  async get(id: number): Promise<Gathering> {
    const { data } = await api.get<Gathering>(
      GATHERING_API.detail(TEAM_ID, id),
    );
    return data;
  }

  /* ✅ 반환 타입을 GatheringParticipant[]로 명시 */
  async participants(
    id: number,
    params?: {
      limit?: number;
      offset?: number;
      sortBy?: "joinedAt";
      sortOrder?: SortOrder;
    },
  ): Promise<GatheringParticipant[]> {
    const { data } = await api.get<GatheringParticipant[]>(
      GATHERING_API.participants(TEAM_ID, id, params),
    );
    return data ?? [];
  }

  async cancel(id: number): Promise<Gathering> {
    const { data } = await api.put<Gathering>(
      GATHERING_API.cancel(TEAM_ID, id),
    );
    return data;
  }

  async join(id: number): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      GATHERING_API.join(TEAM_ID, id),
    );
    return data;
  }

  async leave(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(
      GATHERING_API.leave(TEAM_ID, id),
    );
    return data;
  }

  async joinedList(params?: JoinedListParams): Promise<JoinedGathering[]> {
    const { data } = await api.get<JoinedGathering[]>(
      GATHERING_API.joined(TEAM_ID, params),
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

/* 필요 시 그대로 유지 */
export type { JoinedListParams } from "./endpoints";
