export const LOCATIONS = [
  "지역 전체",
  "홍대입구",
  "을지로 3가",
  "신림",
  "건대입구",
] as const;

export const SORTS = ["마감임박", "참여 인원 순"] as const;

export type DalCategory = "전체" | "오피스 스트레칭" | "마인드풀니스";

export const LIMIT = 20 as const;
