import { useEffect, useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  gatheringService,
  type Gathering,
  type JoinedGatheringsParams,
} from "./gathering.service";
import type { GatheringListParams, GatheringType } from "./endpoints";
import { alert } from "@/shared/store/alert-store";

// ============= Query Keys =============

export const gatheringKeys = {
  all: ["gatherings"] as const,
  detail: (id: number) => [...gatheringKeys.all, "detail", id] as const,
  participants: (id: number, params?: object) =>
    [...gatheringKeys.all, "participants", id, params] as const,
  lists: () => [...gatheringKeys.all, "list"] as const,
  list: (params?: object) => [...gatheringKeys.lists(), params] as const,
  joined: (params?: object) =>
    [...gatheringKeys.all, "joined", params] as const,
  created: (params?: object) =>
    [...gatheringKeys.all, "created", params] as const,
};

// ============= 조회 Queries =============

// 모임 상세 조회
export function useGatheringDetailQuery(id?: number) {
  const enabled = typeof id === "number" && Number.isFinite(id);
  return useQuery({
    queryKey: gatheringKeys.detail(id as number),
    queryFn: () => gatheringService.get(id as number),
    enabled,
    retry: false,
  });
}

// 모임 참가자 목록 조회
export function useGatheringParticipantsQuery(
  gatheringId?: number,
  params: {
    limit?: number;
    sortBy?: "joinedAt";
    sortOrder?: "asc" | "desc";
  } = { limit: 12, sortBy: "joinedAt", sortOrder: "desc" },
) {
  const enabled =
    typeof gatheringId === "number" && Number.isFinite(gatheringId);
  return useQuery({
    queryKey: gatheringKeys.participants(gatheringId as number, params),
    queryFn: () => gatheringService.participants(gatheringId as number, params),
    enabled,
    staleTime: 30_000,
  });
}

type ListFilter = Omit<GatheringListParams, "limit" | "offset" | "ids"> & {
  type?: GatheringType;
  id?: number[];
};

// 모임 목록 무한 스크롤 조회
export function useGatheringsInfiniteQuery(filter: ListFilter, pageSize = 50) {
  // sortOrder 기본값을 desc로 설정
  const filterWithDefaults = useMemo(
    () => ({
      sortOrder: "desc" as const,
      ...filter,
    }),
    [filter],
  );

  const key = useMemo(
    () => gatheringKeys.list({ ...filterWithDefaults, limit: pageSize }),
    [filterWithDefaults, pageSize],
  );

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 0 }) =>
      gatheringService.list({
        ...filterWithDefaults,
        limit: pageSize,
        offset: Number(pageParam) || 0,
      }),
    initialPageParam: 0,
    getNextPageParam: (last: Gathering[], all) =>
      last.length === pageSize ? all.length * pageSize : undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    select: (data) => ({
      ...data,
      flatItems: data.pages.flat(),
    }),
  });
}

// ID 기반 모임 목록 무한 스크롤 조회
export function useGatheringsByIdsInfiniteQuery(
  getIds: () => number[] | Promise<number[]>,
  filter: Omit<ListFilter, "id">,
  pageSize = 30,
) {
  const [allIds, setAllIds] = useState<number[] | null>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ids = await getIds();
      const uniq = Array.from(new Set(ids)).filter((n) => Number.isFinite(n));
      if (alive) setAllIds(uniq as number[]);
    })();
    return () => {
      alive = false;
    };
  }, [getIds]);

  const enabled = Array.isArray(allIds);
  const key = useMemo(
    () =>
      gatheringKeys.list({
        mode: "ids",
        idsHash: (allIds ?? []).join(","),
        ...filter,
        limit: pageSize,
      }),
    [allIds, filter, pageSize],
  );

  return useInfiniteQuery({
    queryKey: key,
    enabled,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const ids = allIds ?? [];
      const offset = Number(pageParam) || 0;
      const slice = ids.slice(offset, offset + pageSize);
      if (slice.length === 0) return [];
      return gatheringService.list({
        ...filter,
        id: slice,
        limit: slice.length,
      });
    },
    getNextPageParam: (_last, _pages, lastPageParam) => {
      const next = (Number(lastPageParam) || 0) + pageSize;
      const total = (allIds ?? []).length;
      return next < total ? next : undefined;
    },
    select: (data) => ({
      ...data,
      flatItems: data.pages.flat(),
    }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

// 참여한 모임 목록 조회
export function useJoinedGatheringsQuery(params?: JoinedGatheringsParams) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: gatheringKeys.joined(params),
    queryFn: () => gatheringService.joinedList(accessToken!, params),
    enabled: !!accessToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

// 내가 만든 모임 목록 조회
export function useCreatedGatheringsQuery(params?: {
  sortBy?: "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
  const { data: session } = useSession();
  const rawId = session?.user?.id;
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

// ============= Mutations =============

// 모임 참가
export function useJoinGatheringMutation(gatheringId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => gatheringService.join(gatheringId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: gatheringKeys.detail(gatheringId) }),
        qc.invalidateQueries({
          queryKey: gatheringKeys.participants(gatheringId),
        }),
        qc.invalidateQueries({ queryKey: gatheringKeys.joined() }),
        qc.invalidateQueries({ queryKey: gatheringKeys.lists(), exact: false }),
      ]);
    },
  });
}

// 모임 참가 취소
export function useLeaveGatheringMutation() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useMutation({
    mutationFn: (gatheringId: number) =>
      gatheringService.leave(accessToken!, gatheringId),
    onSuccess: async (_data, gatheringId) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: gatheringKeys.detail(gatheringId) }),
        qc.invalidateQueries({
          queryKey: gatheringKeys.participants(gatheringId),
        }),
        qc.invalidateQueries({ queryKey: gatheringKeys.joined() }),
        qc.invalidateQueries({ queryKey: gatheringKeys.lists(), exact: false }),
      ]);
      alert("모임 참여가 취소되었습니다.");
    },
    onError: (err: unknown) => {
      alert(err instanceof Error ? err.message : "모임 취소 중 오류 발생");
    },
  });
}