import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockRouter = {
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};
jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("lucide-react", () => ({
  LoaderCircle: (p: any) => <div data-testid="loader" {...p} />,
}));

jest.mock("@/shared/hooks/use-url-filters", () => ({
  useUrlFilters: () => ({
    currentTab: "workation",
    dallaemfitFilter: "all",
    selectedLocation: "all",
    selectedDate: undefined,
    searchParams: new URLSearchParams("sortBy=registrationEnd"),
    updateSearchParams: jest.fn(),
  }),
}));
jest.mock("@/shared/hooks/use-tab-filters", () => ({
  useTabFilters: () => ({
    handleTabChange: jest.fn(),
    handleTypeFilterChange: jest.fn(),
    handleLocationChange: jest.fn(),
    handleDateChange: jest.fn(),
    handleSortChange: jest.fn(),
  }),
}));
jest.mock("@/shared/hooks/use-infinite-scroll", () => {
  const ref: React.RefObject<HTMLDivElement> = {
    current:
      typeof document !== "undefined"
        ? document.createElement("div")
        : (undefined as unknown as HTMLDivElement),
  };
  return { useInfiniteScroll: () => ref };
});

jest.mock("@/features/main/components/banner", () => () => (
  <div data-testid="banner" />
));
jest.mock(
  "@/shared/components/pagetabs",
  () => (props: { onChange?: (t: string) => void }) => (
    <div data-testid="tabs">
      <button onClick={() => props.onChange?.("dallemfit")}>달램핏</button>
      <button onClick={() => props.onChange?.("workation")}>워케이션</button>
    </div>
  ),
);
jest.mock("@/shared/components/filters-bar", () => () => (
  <div data-testid="filters" />
));
jest.mock("@/shared/components/cardskeleton", () => ({
  CardSkeletonGrid: () => <div data-testid="skeleton" />,
}));
jest.mock("@/features/main/components/emptybanner", () => () => (
  <div data-testid="empty" />
));
jest.mock(
  "@/shared/components/card",
  () => (props: { id: number; title: string }) => (
    <li data-testid="card" data-id={props.id}>
      {props.title}
    </li>
  ),
);
jest.mock("@/shared/components/modals", () => ({
  CreateGatheringModal: (p: { open: boolean }) =>
    p.open ? <div data-testid="create-modal" /> : null,
}));
jest.mock("@/shared/components/btnPlus", () => (p: { onClick: () => void }) => (
  <button data-testid="create-btn" onClick={p.onClick}>
    CREATE
  </button>
));

import { useSession } from "next-auth/react";
jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));

import { useGatheringsInfiniteQuery } from "@/shared/services/gathering/use-gathering-queries";
jest.mock("@/shared/services/gathering/use-gathering-queries", () => ({
  useGatheringsInfiniteQuery: jest.fn(),
}));

const setSession = (status: "authenticated" | "unauthenticated") => {
  (useSession as jest.Mock).mockReturnValue(
    status === "authenticated"
      ? { status: "authenticated", data: { user: { id: 1 } } }
      : { status: "unauthenticated", data: null },
  );
};

function makeQueryReturn() {
  return {
    data: { flatItems: [] as Array<unknown> },
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
  };
}
const setQuery = (opts: Partial<ReturnType<typeof makeQueryReturn>> = {}) => {
  (useGatheringsInfiniteQuery as jest.Mock).mockReturnValue({
    ...makeQueryReturn(),
    ...opts,
  });
};

import Page from "./page";

beforeEach(() => {
  jest.useRealTimers();
  mockRouter.push.mockReset();
  setSession("unauthenticated");
  setQuery();
});

describe("메인 페이지 핵심 테스트", () => {
  test("로딩 중일 때 스켈레톤 card 보임", () => {
    setQuery({ isLoading: true });
    render(<Page />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("데이터가 없으면 empty 배너가 보임", async () => {
    setQuery({ data: { flatItems: [] }, isLoading: false });
    render(<Page />);
    expect(await screen.findByTestId("empty")).toBeInTheDocument();
  });

  test("데이터가 있으면 card 컴포넌트를 map으로 렌더함", async () => {
    setQuery({
      data: {
        flatItems: [
          {
            id: 11,
            name: "모임1",
            location: "홍대입구",
            dateTime: "2025-12-01T10:00:00+09:00",
            registrationEnd: "2025-11-30T23:59:00+09:00",
            participantCount: 1,
            capacity: 10,
            image: null,
            canceledAt: null,
            type: "WORKATION",
          },
          {
            id: 22,
            name: "모임2",
            location: "홍대입구",
            dateTime: "2025-12-02T10:00:00+09:00",
            registrationEnd: null,
            participantCount: 2,
            capacity: 8,
            image: null,
            canceledAt: null,
            type: "WORKATION",
          },
        ],
      },
    });
    render(<Page />);
    const cards = await screen.findAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("모임1");
    expect(cards[1]).toHaveTextContent("모임2");
  });
});
