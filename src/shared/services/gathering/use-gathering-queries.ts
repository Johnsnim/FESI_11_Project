import { useQuery } from "@tanstack/react-query";
import { getJoinedGatherings } from "./gathering.service";
import { useSession } from "next-auth/react";
import type { JoinedGatheringsParams } from "./gathering.service";

// Query Keys
export const gatheringKeys = {
  all: ["gatherings"] as const,
  joined: (params?: JoinedGatheringsParams) =>
    [...gatheringKeys.all, "joined", params] as const,
};

// 내가 참여한 모임 목록 조회
export function useJoinedGatheringsQuery(params?: JoinedGatheringsParams) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: gatheringKeys.joined(params),
    queryFn: () => getJoinedGatherings(accessToken!, params),
    enabled: !!accessToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
