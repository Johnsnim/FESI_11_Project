"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CreateGatheringModal } from "@/shared/components/modals";
import Banner from "@/features/main/components/banner";
import ButtonPlus from "@/shared/components/btnPlus";
import PageTabs, { TabItem } from "@/shared/components/pagetabs";
import Card from "@/shared/components/card";
import FiltersBar from "@/shared/components/filters-bar";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";

import { useGatheringsInfiniteQuery } from "@/shared/services/gathering/use-gathering-queries";
import type { GatheringType } from "@/shared/services/gathering/endpoints";
import type { Location } from "@/shared/services/review/review.service";
import EmptyBanner from "@/features/main/components/emptybanner";

type DallaemfitFilter = "all" | "OFFICE_STRETCHING" | "MINDFULNESS";
type MainPageSortBy = "registrationEnd" | "participantCount" | "dateTime";

const TABS: TabItem[] = [
  {
    value: "dallemfit",
    label: "달램핏",
    imageUrl: "/image/ic_mind_md.svg",
    imageAlt: "달램핏 아이콘",
  },
  {
    value: "workation",
    label: "워케이션",
    imageUrl: "/image/ic_ parasol_md.svg",
    imageAlt: "워케이션 아이콘",
  },
];

const SORT_OPTIONS: Array<{ value: MainPageSortBy; label: string }> = [
  { value: "registrationEnd", label: "마감임박순" },
  { value: "participantCount", label: "참여인원순" },
  { value: "dateTime", label: "모임시작임박" },
];

const DALLAEMFIT_TYPES = ["DALLAEMFIT", "OFFICE_STRETCHING", "MINDFULNESS"];

function MainPageContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  // URL 파라미터 읽기
  const currentTab = searchParams.get("tab") ?? "dallemfit";
  const dallaemfitFilter = (searchParams.get("type") ?? "all") as DallaemfitFilter;
  const selectedLocation = (searchParams.get("location") ?? "all") as Location | "all";
  const selectedDate = searchParams.get("date") ?? undefined;
  const sortBy = searchParams.get("sortBy") as MainPageSortBy | null;

  // API 파라미터 변환
  const apiParams = useMemo(() => {
    const type: GatheringType | undefined = 
      currentTab === "workation" ? "WORKATION" 
      : dallaemfitFilter === "all" ? undefined 
      : (dallaemfitFilter as GatheringType);

    const location = selectedLocation === "all" ? undefined : selectedLocation;
    const apiSortBy = sortBy || "dateTime";
    const sortOrder = !sortBy || sortBy === "registrationEnd" ? "asc" : "desc";

    return { type, location, date: selectedDate, sortBy: apiSortBy, sortOrder } as const;
  }, [currentTab, dallaemfitFilter, selectedLocation, selectedDate, sortBy]);

  // 무한 스크롤 쿼리
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGatheringsInfiniteQuery(apiParams, 40);

  // 모집 중 / 마감 우선순위로 정렬
  const sortedGatherings = useMemo(() => {
    const items = data?.flatItems ?? [];
    
    // 달램핏 탭에서 type="all"이면 클라이언트 필터링
    const filteredItems = 
      currentTab === "dallemfit" && dallaemfitFilter === "all"
        ? items.filter((g) => DALLAEMFIT_TYPES.includes(g.type))
        : items;

    const now = new Date();
    
    // 우선순위 부여 및 정렬
    return filteredItems
      .map((g) => {
        const isClosed = g.canceledAt || (g.registrationEnd && new Date(g.registrationEnd) < now);
        return { ...g, priority: isClosed ? 1 : 0 };
      })
      .sort((a, b) => a.priority - b.priority);
  }, [data?.flatItems, currentTab, dallaemfitFilter]);

  // 무한 스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);
    
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // URL 파라미터 업데이트 헬퍼
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // 이벤트 핸들러들
  const handleTabChange = useCallback(
    (tab: string) => {
      updateSearchParams({ tab, type: null });
    },
    [updateSearchParams]
  );

  const handleTypeFilterChange = useCallback(
    (type: DallaemfitFilter) => {
      if (currentTab === "workation") return;
      updateSearchParams({ type: type === "all" ? null : type });
    },
    [currentTab, updateSearchParams]
  );

  const handleLocationChange = useCallback(
    (location: Location | "all") => {
      updateSearchParams({ location: location === "all" ? null : location });
    },
    [updateSearchParams]
  );

  const handleDateChange = useCallback(
    (date: string | undefined) => {
      updateSearchParams({ date: date || null });
    },
    [updateSearchParams]
  );

  const handleSortChange = useCallback(
    (sort: MainPageSortBy | null) => {
      updateSearchParams({ sortBy: sort || null });
    },
    [updateSearchParams]
  );

  const handleCreateClick = useCallback(() => {
    if (status !== "authenticated") {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }
    setModalOpen(true);
  }, [status, router]);

  return (
    <div className="w-full overflow-x-hidden pb-20 md:px-5 lg:mx-5 lg:mt-10 lg:px-0">
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />

      <PageTabs
        currentTab={currentTab}
        onChange={handleTabChange}
        tabs={TABS}
        tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
        imageClassName="size-8 md:size-11"
      />

      <FiltersBar
        showTypeFilter={currentTab === "dallemfit"}
        dallaemfitFilter={dallaemfitFilter}
        setDallaemfitFilter={handleTypeFilterChange}
        selectedLocation={selectedLocation}
        setSelectedLocation={handleLocationChange}
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
        sortBy={sortBy || "registrationEnd"}
        setSortBy={handleSortChange}
        sortOptions={SORT_OPTIONS}
      />

      <div className="mt-6">
        {isLoading ? (
          <CardSkeletonGrid count={6} />
        ) : sortedGatherings.length === 0 ? (
          <EmptyBanner/>
        ) : (
         <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {sortedGatherings.map((gathering) => (
              <Card
                key={gathering.id}
                id={gathering.id}
                title={gathering.name}
                location={gathering.location}
                dateTimeISO={gathering.dateTime}
                registrationEndISO={gathering.registrationEnd}
                participantCount={gathering.participantCount}
                capacity={gathering.capacity}
                image={gathering.image}
                isCanceled={!!gathering.canceledAt}
              />
            ))}

            <div ref={observerTarget} className="flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="py-4 text-sm text-gray-500">로딩 중...</div>
              )}
            </div>
          </div>
        )}
      </div>

      <ButtonPlus onClick={handleCreateClick} aria-label="모임 만들기" />

      <CreateGatheringModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={() => setModalOpen(false)}
      />
    </div>
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩중...</div>}>
      <MainPageContent />
    </Suspense>
  );
}