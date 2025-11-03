import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card, { CardProps } from "./card";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

jest.mock("./progressbar", () => ({
  __esModule: true,
  default: () => <div data-testid="progressbar" />,
}));

const useWishlistMock = jest.fn();
jest.mock("../hooks/use-wishlist", () => ({
  useWishlist: () => useWishlistMock(),
}));

jest.mock("./wish-button", () => (props: any) => (
  <button
    aria-label="wish"
    aria-pressed={props.isWished}
    onClick={props.onClick}
  >
    WISH
  </button>
));

function makeProps(overrides: Partial<CardProps> = {}): CardProps {
  return {
    id: 1,
    title: "테스트 모임",
    location: "홍대입구",
    dateTimeISO: "2025-11-03T10:00:00+09:00",
    registrationEndISO: "2025-11-02T23:59:00+09:00",
    participantCount: 3,
    capacity: 10,
    image: null,
    isCanceled: false,
    ...overrides,
  };
}

beforeEach(() => {
  jest.useRealTimers();
  pushMock.mockClear();
  useWishlistMock.mockReset().mockReturnValue({
    isWished: false,
    toggleWish: jest.fn(),
  });
});

describe("Card 핵심 동작", () => {
  test("모집 가능 시 참여하기 버튼 클릭하면 상세 페이지로 이동", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-11-01T12:00:00+09:00"));
    render(
      <Card
        {...makeProps({ registrationEndISO: "2025-11-02T23:59:00+09:00" })}
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "참여하기" })[0]);
    expect(pushMock).toHaveBeenCalledWith("/detail/1");
  });

  test("등록 마감이 지났으면 '모집 마감' 보이면서 버튼 비활성화", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-11-02T12:00:00+09:00"));
    render(
      <Card
        {...makeProps({
          registrationEndISO: "2025-11-02T11:00:00+09:00",
          dateTimeISO: "2025-11-03T10:00:00+09:00",
        })}
      />,
    );
    expect(screen.getByText("모집 마감")).toBeInTheDocument();
    screen.getAllByRole("button", { name: "참여하기" }).forEach((b) => {
      expect(b).toBeDisabled();
    });
  });

  test("취소된 모임이면 '취소됨' 보이면서 버튼 비활성화", () => {
    render(<Card {...makeProps({ isCanceled: true })} />);
    expect(screen.getByText("취소됨")).toBeInTheDocument();
    screen.getAllByRole("button", { name: "참여하기" }).forEach((b) => {
      expect(b).toBeDisabled();
    });
  });

  test("찜하기 버튼 클릭 시 toggleWish로 버튼 토글", () => {
    const toggle = jest.fn();
    useWishlistMock.mockReturnValue({ isWished: false, toggleWish: toggle });
    render(<Card {...makeProps()} />);
    fireEvent.click(screen.getByRole("button", { name: "wish" }));
    expect(toggle).toHaveBeenCalled();
  });
});
