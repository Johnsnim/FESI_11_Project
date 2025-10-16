import type { Gathering } from "@/shared/services/gathering/gathering.service";
export type GatheringDetail = Gathering;

export type ReviewItem = {
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
};

export type ReviewResponse = {
  data: ReviewItem[];
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
};
