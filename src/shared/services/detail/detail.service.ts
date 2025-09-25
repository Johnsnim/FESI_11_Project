import { api } from "@/lib/api/api";
import { DETAIL_API } from "./endpoints";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID as string;

type GatheringDetail = {
  teamId: number;
  id: number;
  type: string;
  name: string;
  dateTime: string;
  registrationEnd: string;
  location: string;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt: string | null;
};

export const detailService = {
  async get(id: number) {
    const { data } = await api.get<GatheringDetail>(
      DETAIL_API.get(TEAM_ID, id),
    );
    return data;
  },
};
