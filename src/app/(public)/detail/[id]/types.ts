export type GatheringDetail = {
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
