import type { ServiceType } from "./types";

export const SERVICES: {
  key: ServiceType;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    key: "OFFICE_STRETCHING",
    title: "달램핏",
    subtitle: "오피스 스트레칭",
    icon: "/image/ic_stretch_lg.svg",
  },
  {
    key: "MINDFULNESS",
    title: "달램핏",
    subtitle: "마인드 풀니스",
    icon: "/image/ic_mind_md.svg",
  },
  {
    key: "WORKATION",
    title: "워케이션",
    subtitle: "",
    icon: "/image/ic_ parasol_md.svg",
  },
];

export const LOCATIONS = [
  "홍대입구",
  "을지로 3가",
  "신림",
  "건대입구",
] as const;
