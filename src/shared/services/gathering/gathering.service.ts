// 📁 shared/services/gathering/gathering.service.ts
import { api } from "@/lib/api/api";
import {
  GATHERING_API,
  type GatheringListParams,
  type JoinedListParams,
  type GatheringType,
  type SortOrder,
} from "./endpoints";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID as string;

// ============= 타입 정의 =============

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

export interface JoinedGathering extends Gathering {
  joinedAt: string;
  isCompleted: boolean;
  isReviewed: boolean;
}

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

export interface CreateGatheringRequest {
  type: GatheringType;
  name: string;
  location: string;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  imageFile?: File | null;
}

export interface JoinedGatheringsParams {
  completed?: boolean;
  reviewed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
  sortOrder?: "asc" | "desc";
}

export type MainPageSortBy =
  | "registrationEnd"
  | "participantCount"
  | "dateTime";


export class GatheringService {
  // 모임 목록 조회
  async list(params?: GatheringListParams): Promise<Gathering[]> {
    const { data } = await api.get<Gathering[]>(
      GATHERING_API.list(TEAM_ID, params),
    );
    return data ?? [];
  }

  // 모임 상세 조회
  async get(id: number): Promise<Gathering> {
    const { data } = await api.get<Gathering>(
      GATHERING_API.detail(TEAM_ID, id),
    );
    return data;
  }

  // 모임 참가자 목록 조회
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

  // 모임 생성
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

  // 모임 취소
  async cancel(id: number): Promise<Gathering> {
    const { data } = await api.put<Gathering>(
      GATHERING_API.cancel(TEAM_ID, id),
    );
    return data;
  }

  // 모임 참가
  async join(id: number): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      GATHERING_API.join(TEAM_ID, id),
    );
    return data;
  }

  // 모임 참가 취소
  async leave(accessToken: string, id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(
      GATHERING_API.leave(TEAM_ID, id),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  }

  // 참여한 모임 목록 조회
  async joinedList(
    accessToken: string,
    params?: JoinedGatheringsParams,
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
}

// 싱글톤 인스턴스 export
export const gatheringService = new GatheringService();

// ============= 레거시 지원 (하위 호환성) =============
// 기존 코드에서 사용 중이라면 유지, 아니면 제거

export async function getJoinedGatherings(
  accessToken: string,
  params?: JoinedGatheringsParams,
): Promise<JoinedGathering[]> {
  return gatheringService.joinedList(accessToken, params);
}

export async function leaveGathering(
  accessToken: string,
  gatheringId: number,
): Promise<{ message: string }> {
  return gatheringService.leave(accessToken, gatheringId);
}

// 타입 재export
export type { JoinedListParams } from "./endpoints";
