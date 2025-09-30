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
      formData.append("image", payload.imageFile);
    }

    const { data } = await api.post<Gathering>(
      GATHERING_API.create(TEAM_ID),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return data;
  }
}

export const gatheringService = new GatheringService();
