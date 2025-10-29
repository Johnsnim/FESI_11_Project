"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { CreateGatheringModal } from "@/shared/components/modals";
import Banner from "@/features/main/components/banner";
import ButtonPlus from "@/shared/components/btnPlus";
import PageTabs from "@/shared/components/pagetabs";
import Card from "@/shared/components/card";
import FiltersBar from "@/shared/components/filters-bar";
import { CardSkeletonGrid } from "@/shared/components/cardskeleton";
import { useGatheringsInfiniteQuery } from "@/shared/services/gathering/use-gathering-queries";
import type { GatheringType } from "@/shared/services/gathering/endpoints";
import EmptyBanner from "@/features/main/components/emptybanner";
import { LoaderCircle } from "lucide-react";
import { MainPageSortBy } from "@/shared/services/gathering/gathering.service";
import { useUrlFilters } from "@/shared/hooks/use-url-filters";
import { useTabFilters } from "@/shared/hooks/use-tab-filters";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

const TABS = [
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

  const {
    currentTab,
    dallaemfitFilter,
    selectedLocation,
    selectedDate,
    searchParams,
    updateSearchParams,
  } = useUrlFilters();

  const sortBy =
    (searchParams.get("sortBy") as MainPageSortBy) || "registrationEnd";
  const handlers = useTabFilters<MainPageSortBy>(
    updateSearchParams,
    currentTab,
  );

  const apiParams = useMemo(() => {
    const type: GatheringType | undefined =
      currentTab === "workation"
        ? "WORKATION"
        : dallaemfitFilter === "all"
          ? undefined
          : (dallaemfitFilter as GatheringType);

    return {
      type,
      location: selectedLocation === "all" ? undefined : selectedLocation,
      date: selectedDate,
      sortBy: sortBy || "dateTime",
      sortOrder: !sortBy || sortBy === "registrationEnd" ? "asc" : "desc",
    } as const;
  }, [currentTab, dallaemfitFilter, selectedLocation, selectedDate, sortBy]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGatheringsInfiniteQuery(apiParams, 40);

  const gatherings = useMemo(() => {
    const items = data?.flatItems ?? [];
    const filteredItems =
      currentTab === "dallemfit" && dallaemfitFilter === "all"
        ? items.filter((g) => DALLAEMFIT_TYPES.includes(g.type))
        : items;

    const now = new Date();
    return filteredItems
      .map((g) => {
        const isClosed =
          g.canceledAt ||
          (g.registrationEnd && new Date(g.registrationEnd) < now);
        return { ...g, priority: isClosed ? 1 : 0 };
      })
      .sort((a, b) => a.priority - b.priority);
  }, [data?.flatItems, currentTab, dallaemfitFilter]);

  const observerTarget = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    { rootMargin: "200px" },
  );

  const handleCreateClick = () => {
    if (status !== "authenticated") {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="w-full pb-20 md:px-5 lg:mx-5 lg:mt-10 lg:px-0">
      <Banner
        subtitle="함께할 사람을 찾고 계신가요?"
        title="지금 모임에 참여해보세요"
      />

      <div className="mb-4 space-y-4 md:mt-7.5 md:mb-6 md:space-y-8 lg:mt-[27px]">
        <PageTabs
          currentTab={currentTab}
          onChange={handlers.handleTabChange}
          tabs={TABS}
          tabsTriggerClassName="gap-1.5 md:w-[180px] md:text-xl text-base font-semibold relative flex-1 cursor-pointer focus-visible:ring-0 focus-visible:outline-none"
          imageClassName="size-8 md:size-11"
        />

        <FiltersBar
          showTypeFilter={currentTab === "dallemfit"}
          dallaemfitFilter={dallaemfitFilter}
          setDallaemfitFilter={handlers.handleTypeFilterChange}
          selectedLocation={selectedLocation}
          setSelectedLocation={handlers.handleLocationChange}
          selectedDate={selectedDate}
          setSelectedDate={handlers.handleDateChange}
          sortBy={sortBy}
          setSortBy={handlers.handleSortChange}
          sortOptions={SORT_OPTIONS}
        />
      </div>

      {isLoading ? (
        <CardSkeletonGrid count={8} />
      ) : gatherings.length === 0 ? (
        <EmptyBanner />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {gatherings.map((gathering) => (
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

          <div
            ref={observerTarget}
            className="flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <LoaderCircle className="mt-6 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      )}

      <ButtonPlus onClick={handleCreateClick} aria-label="모임 만들기" />

      {modalOpen && (
        <CreateGatheringModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onComplete={() => setModalOpen(false)}
        />
      )}
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
