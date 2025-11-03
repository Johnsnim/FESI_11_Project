import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

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

jest.mock("@/shared/hooks/use-infinite-scroll", () => ({
  useInfiniteScroll: () => ({ current: null }),
}));

jest.mock("@/features/main/components/banner", () => () => (
  <div data-testid="banner" />
));
jest.mock("@/shared/components/pagetabs", () => (props: any) => (
  <div data-testid="tabs">
    <button onClick={() => props.onChange?.("dallemfit")}>달램핏</button>
    <button onClick={() => props.onChange?.("workation")}>워케이션</button>
  </div>
));
jest.mock("@/shared/components/filters-bar", () => () => (
  <div data-testid="filters" />
));
jest.mock("@/shared/components/cardskeleton", () => ({
  CardSkeletonGrid: () => <div data-testid="skeleton" />,
}));
jest.mock("@/features/main/components/emptybanner", () => () => (
  <div data-testid="empty" />
));
jest.mock("@/shared/components/card", () => (props: any) => (
  <li data-testid="card" data-id={props.id}>
    {props.title}
  </li>
));
jest.mock("@/shared/components/modals", () => ({
  CreateGatheringModal: (p: any) =>
    p.open ? <div data-testid="create-modal" /> : null,
}));
jest.mock("@/shared/components/btnPlus", () => (p: any) => (
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

const setQuery = (opts: Partial<ReturnType<typeof makeQueryReturn>> = {}) => {
  (useGatheringsInfiniteQuery as jest.Mock).mockReturnValue({
    ...makeQueryReturn(),
    ...opts,
  });
};

function makeQueryReturn() {
  return {
    data: { flatItems: [] as any[] },
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
  };
}

beforeEach(() => {
  jest.useRealTimers();
  pushMock.mockReset();
  setSession("unauthenticated");
  setQuery();
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("메인 페이지 핵심 테스트", () => {
  test("로딩 중일 때 스켈레톤 card 보임", () => {
    setQuery({ isLoading: true });
    render(<Page />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("데이터가 없으면 empty 배너가 보임", () => {
    setQuery({ data: { flatItems: [] } });
    render(<Page />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  test("데이터가 있으면 card 컴포넌트를 map으로 렌더함", () => {
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
    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("모임1");
    expect(cards[1]).toHaveTextContent("모임2");
  });

  describe("모임 만들기 모달", () => {
    test("비로그인 상태면 로그인 페이지로 이동", () => {
      setSession("unauthenticated");
      render(<Page />);
      fireEvent.click(screen.getByTestId("create-btn"));
      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    test("로그인 상태면 모달 열림", () => {
      setSession("authenticated");
      render(<Page />);
      fireEvent.click(screen.getByTestId("create-btn"));
      expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });
  });
});
