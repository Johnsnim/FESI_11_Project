import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import DetailPage from "./page";

const useGatheringDetailQueryMock = jest.fn();
const useJoinedGatheringsQueryMock = jest.fn();
const useJoinGatheringMutationMock = jest.fn();
const useLeaveGatheringMutationMock = jest.fn();

const GI = jest.fn((_p: any) => null);

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

jest.mock("@/shared/services/gathering/use-gathering-queries", () => ({
  useGatheringDetailQuery: (...args: any[]) =>
    useGatheringDetailQueryMock(...args),
  useJoinedGatheringsQuery: (...args: any[]) =>
    useJoinedGatheringsQueryMock(...args),
  useJoinGatheringMutation: (...args: any[]) =>
    useJoinGatheringMutationMock(...args),
  useLeaveGatheringMutation: (...args: any[]) =>
    useLeaveGatheringMutationMock(...args),
}));

jest.mock("@/shared/services/review/user-review-queries", () => ({
  useGatheringReviewsQuery: () => ({
    data: { data: [], totalPages: 1 },
    isLoading: false,
  }),
}));

jest.mock("@/features/detail/components/gatheringimage", () => () => null);
jest.mock("@/features/detail/components/participants", () => () => null);
jest.mock("@/shared/components/review-list", () => () => null);
jest.mock("@/shared/components/pagination", () => () => null);

jest.mock(
  "@/features/detail/components/gatheringinfo",
  () => (p: any) => GI(p),
);

const mokedGathering = {
  id: 1,
  name: "테스트 모임",
  location: "홍대입구",
  dateTime: "2025-11-03T10:00:00+09:00",
  registrationEnd: "2025-11-02T23:59:00+09:00",
  image: null,
  capacity: 10,
  participantCount: 3,
  createdBy: 123,
  canceledAt: null as string | null,
};

beforeEach(() => {
  jest.clearAllMocks();
  useGatheringDetailQueryMock.mockReturnValue({
    data: mokedGathering,
    isLoading: false,
  });
  useJoinedGatheringsQueryMock.mockReturnValue({ data: [] });
  useJoinGatheringMutationMock.mockReturnValue({ mutate: jest.fn() });
  useLeaveGatheringMutationMock.mockReturnValue({ mutate: jest.fn() });
});

describe("DetailPage 핵심 동작(짧게)", () => {
  test("isJoined=false로 내려가고 onJoin/onLeave 핸들러가 각 mutate 호출", () => {
    render(<DetailPage />);

    expect(GI).toHaveBeenCalled();

    const [[props]] = GI.mock.calls as [
      [
        {
          isJoined: boolean;
          onJoin: () => void;
          onLeave: () => void;
          joining?: boolean;
          leaving?: boolean;
        },
      ],
    ];

    expect(props.isJoined).toBe(false);

    props.onJoin();
    props.onLeave();

    const joinMutate = (
      useJoinGatheringMutationMock.mock.results[0].value as {
        mutate: jest.Mock;
      }
    ).mutate;
    const leaveMutate = (
      useLeaveGatheringMutationMock.mock.results[0].value as {
        mutate: jest.Mock;
      }
    ).mutate;

    expect(joinMutate).toHaveBeenCalledTimes(1);
    expect(leaveMutate).toHaveBeenCalledWith(1);
  });

  test("내가 참여한 모임 목록에 id가 있으면 isJoined=true로 전달", () => {
    useJoinedGatheringsQueryMock.mockReturnValueOnce({ data: [{ id: 1 }] });

    render(<DetailPage />);

    expect(GI).toHaveBeenCalled();
    const [[props]] = GI.mock.calls as [[{ isJoined: boolean }]];
    expect(props.isJoined).toBe(true);
  });
});
