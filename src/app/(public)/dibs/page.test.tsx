import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "123" } },
    status: "authenticated",
  }),
}));

type NextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  priority?: boolean;
};
jest.mock("next/image", () => (props: NextImageProps) => {
  const { src, alt = "", priority: _omit, ...rest } = props;
  return <img src={src} alt={alt} {...rest} />;
});

jest.mock("@/shared/components/pagetabs", () => () => null);
jest.mock("@/shared/components/filters-bar", () => () => null);
jest.mock("@/shared/components/cardskeleton", () => ({
  CardSkeletonGrid: () => <div data-testid="skeleton" />,
}));
jest.mock("@/features/main/components/emptybanner", () => () => (
  <div data-testid="empty" />
));
jest.mock("@/shared/components/card", () => (p: { title: string }) => (
  <div data-testid="card">{p.title}</div>
));

jest.mock("@/shared/hooks/use-url-filters", () => ({
  useUrlFilters: () => ({
    currentTab: "workation",
    dallaemfitFilter: "all",
    selectedLocation: "all",
    selectedDate: undefined,
    searchParams: new URLSearchParams(""),
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

const useGatheringsByIdsInfiniteQueryMock = jest.fn();
jest.mock("@/shared/services/gathering/use-gathering-queries", () => ({
  useGatheringsByIdsInfiniteQuery: (...args: unknown[]) =>
    useGatheringsByIdsInfiniteQueryMock(...(args as [])),
}));

import DibsPage from "./page";

describe("DibsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("로딩 중일 때 스켈레톤이 나옴", () => {
    useGatheringsByIdsInfiniteQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<DibsPage />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("데이터가 있으면 map으로 Card 렌더함", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-11-01T12:00:00+09:00"));

    useGatheringsByIdsInfiniteQueryMock.mockReturnValue({
      data: {
        flatItems: [
          {
            id: 11,
            name: "찜한모임1",
            location: "A",
            dateTime: "2025-11-03T10:00:00+09:00",
            registrationEnd: "2025-11-02T23:59:00+09:00",
            participantCount: 1,
            capacity: 10,
            image: null,
            canceledAt: null,
            type: "DALLAEMFIT",
          },
          {
            id: 22,
            name: "찜한모임2",
            location: "B",
            dateTime: "2025-11-04T10:00:00+09:00",
            registrationEnd: "2025-11-03T23:59:00+09:00",
            participantCount: 2,
            capacity: 10,
            image: null,
            canceledAt: null,
            type: "WORKATION",
          },
        ],
      },
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<DibsPage />);

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("찜한모임1");
    expect(cards[1]).toHaveTextContent("찜한모임2");

    jest.useRealTimers();
  });

  test("데이터 없을 때 EmptyBanner 렌더함", () => {
    useGatheringsByIdsInfiniteQueryMock.mockReturnValue({
      data: { flatItems: [] },
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<DibsPage />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("card")).toHaveLength(0);
  });
});
