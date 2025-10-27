// src/features/main/components/dibs-category.tsx
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent } from "@/shadcn/tabs";
import {
  Gathering,
  gatheringService,
} from "@/shared/services/gathering/gathering.service";

import { CardSkeletonGrid } from "@/shared/components/cardskeleton";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { GatheringType } from "@/shared/services/gathering/endpoints";
import {
  DalCategory,
  LOCATIONS,
  SORTS,
} from "@/features/main/components/category/constants";
import { TabsBar } from "@/features/main/components/category/tabsbar";
import FiltersBar from "@/features/main/components/category/filterbar";
import EmptyBanner from "@/features/main/components/emptybanner";
import { ItemsGrid } from "@/features/main/components/category/itemsgrid";

const PAGE_SIZE = 30;

function getUserId(u: { id?: number | string } | undefined | null) {
  const raw = u?.id;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readDibs(userId: number | null): number[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const k1 = localStorage.getItem(`dibs:${userId}`);
    if (k1) {
      const arr = JSON.parse(k1);
      if (Array.isArray(arr)) {
        return Array.from(new Set(arr.map(Number))).filter(Number.isFinite);
      }
    }

    const k2 = localStorage.getItem("dibs");
    if (k2) {
      const obj = JSON.parse(k2);
      const arr = Array.isArray(obj?.[userId]) ? obj[userId] : [];
      return Array.from(new Set(arr.map(Number))).filter(Number.isFinite);
    }
  } catch {}
  return [];
}

export default function DibsCategory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const value: "dal" | "wor" = tabParam === "workation" ? "wor" : "dal";
  const pushWithTab = React.useCallback(
    (next: "dal" | "wor") => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", next === "wor" ? "workation" : "dallemfit");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const { data: session } = useSession();
  const myId = getUserId(session?.user as any);

  const [dibIds, setDibIds] = React.useState<number[]>([]);
  React.useEffect(() => {
    setDibIds(readDibs(myId));
  }, [myId]);

  const [regionLabel, setRegionLabel] =
    React.useState<(typeof LOCATIONS)[number]>("지역 전체");
  const [sortLabel, setSortLabel] =
    React.useState<(typeof SORTS)[number]>("마감임박");
  const [dalCategory, setDalCategory] = React.useState<DalCategory>("전체");
  const [date, setDate] = React.useState<Date | null>(null);

  const typeForDal: GatheringType[] =
    dalCategory === "오피스 스트레칭"
      ? ["OFFICE_STRETCHING"]
      : dalCategory === "마인드풀니스"
        ? ["MINDFULNESS"]
        : ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"];

  const wantTypes: GatheringType[] =
    value === "wor" ? (["WORKATION"] as GatheringType[]) : typeForDal;

  const [allDetails, setAllDetails] = React.useState<Gathering[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    async function run() {
      if (!dibIds.length) {
        setAllDetails([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled(
          dibIds.map((id) => gatheringService.get(id)),
        );
        const ok = results
          .filter(
            (r): r is PromiseFulfilledResult<Gathering> =>
              r.status === "fulfilled",
          )
          .map((r) => r.value);
        if (alive) setAllDetails(ok);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "불러오기에 실패했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [dibIds]);

  const filteredSorted = React.useMemo(() => {
    if (!allDetails) return [];
    let arr = allDetails.slice();

    arr = arr.filter((g) => wantTypes.includes(g.type as GatheringType));

    if (regionLabel !== "지역 전체") {
      arr = arr.filter((g) => g.location === regionLabel);
    }

    if (date) {
      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate();
      arr = arr.filter((g) => {
        const dt = new Date(g.dateTime);
        return (
          dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
        );
      });
    }

    if (sortLabel === "마감임박") {
      arr.sort((a, b) => {
        const A = a.registrationEnd
          ? new Date(a.registrationEnd).getTime()
          : Infinity;
        const B = b.registrationEnd
          ? new Date(b.registrationEnd).getTime()
          : Infinity;
        return A - B;
      });
    } else {
      arr.sort((a, b) => b.participantCount - a.participantCount);
    }
    return arr;
  }, [allDetails, wantTypes, regionLabel, date, sortLabel]);

  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [value, regionLabel, sortLabel, dalCategory, date, dibIds.join(",")]);

  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((c) =>
            Math.min(c + PAGE_SIZE, filteredSorted.length),
          );
        }
      },
      { root: null, rootMargin: "1000px 0px 600px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filteredSorted.length]);

  const showing = filteredSorted.slice(0, visibleCount);

  return (
    <Tabs
      value={value}
      onValueChange={(v) => pushWithTab(v as "dal" | "wor")}
      className="mb-7"
    >
      <TabsBar value={value} onChange={(v) => pushWithTab(v)} />

      <TabsContent value="dal" className="mt-4">
        <FiltersBar
          regionLabel={regionLabel}
          setRegionLabel={setRegionLabel}
          sortLabel={sortLabel}
          setSortLabel={setSortLabel}
          dalCategory={dalCategory}
          setDalCategory={setDalCategory}
          date={date}
          setDate={setDate}
        />

        {loading && <CardSkeletonGrid />}
        {error && <EmptyBanner />}

        {!loading && !error && (
          <>
            {showing.length === 0 ? (
              <EmptyBanner />
            ) : (
              <>
                <ItemsGrid items={showing} />
                <div ref={loaderRef} className="h-10" />
                {visibleCount < filteredSorted.length && (
                  <CardSkeletonGrid count={1} />
                )}
              </>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="wor" className="mt-4">
        {loading && <CardSkeletonGrid />}
        {error && <EmptyBanner />}
        {!loading && !error && (
          <>
            {showing.length === 0 ? (
              <EmptyBanner />
            ) : (
              <>
                <ItemsGrid items={showing} />
                <div ref={loaderRef} className="h-10" />
                {visibleCount < filteredSorted.length && (
                  <CardSkeletonGrid count={1} />
                )}
              </>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
