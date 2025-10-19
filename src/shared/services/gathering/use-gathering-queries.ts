import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJoinedGatherings, leaveGathering } from "./gathering.service";
import { gatheringService } from "@/shared/services/gathering/gathering.service";
import { useSession } from "next-auth/react";
import type { JoinedGatheringsParams } from "./gathering.service";

// Query Keys
export const gatheringKeys = {
  all: ["gatherings"] as const,
  joined: (params?: JoinedGatheringsParams) =>
    [...gatheringKeys.all, "joined", params] as const,
  created: (params?: object) =>
    [...gatheringKeys.all, "created", params] as const,
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

//모임 참여 취소
export function useLeaveGatheringMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useMutation({
    mutationFn: (gatheringId: number) =>
      leaveGathering(accessToken!, gatheringId),
    onSuccess: async () => {
      // 참여 목록 최신화
      await queryClient.invalidateQueries({ queryKey: gatheringKeys.joined() });
      alert("모임 참여가 취소되었습니다.");
    },
    onError: (error: unknown) => {
      console.error(error);
      alert(error instanceof Error ? error.message : "모임 취소 중 오류 발생");
    },
  });
}

//내가만든 모임 조회
export function useCreatedGatheringsQuery(params?: {
  sortBy?: "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
  const { data: session } = useSession();
  const rawId = session?.user?.id; // string | number | undefined

  const createdBy =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string"
        ? Number(rawId)
        : undefined;

  const enabled = typeof createdBy === "number" && Number.isFinite(createdBy);

  return useQuery({
    queryKey: gatheringKeys.created({ ...params, createdBy }),
    queryFn: () =>
      gatheringService.list({
        ...params,
        createdBy,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
