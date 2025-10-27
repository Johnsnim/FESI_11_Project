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
  getJoinedGatherings,
  leaveGathering,
  type Gathering,
} from "@/shared/services/gathering/gathering.service";
import type {
  GatheringListParams,
  GatheringType,
} from "@/shared/services/gathering/endpoints";

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

export function useGatheringDetailQuery(id?: number) {
  const enabled = typeof id === "number" && Number.isFinite(id);
  return useQuery({
    queryKey: gatheringKeys.detail(id as number),
    queryFn: () => gatheringService.get(id as number),
    enabled,
    retry: false,
  });
}

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

export function useGatheringsInfiniteQuery(filter: ListFilter, pageSize = 30) {
  const key = useMemo(
    () => gatheringKeys.list({ ...filter, limit: pageSize }),
    [filter, pageSize],
  );

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 0 }) =>
      gatheringService.list({
        ...filter,
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

export function useJoinedGatheringsQuery(params?: {
  limit?: number;
  offset?: number;
}) {
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

export function useLeaveGatheringMutation() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useMutation({
    mutationFn: (gatheringId: number) =>
      leaveGathering(accessToken!, gatheringId),
    onSuccess: async (_d, gatheringId) => {
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
      console.error(err);
      alert(err instanceof Error ? err.message : "모임 취소 중 오류 발생");
    },
  });
}

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
