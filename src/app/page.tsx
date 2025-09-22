import Image from "next/image";
import { AlertBadge } from "@/shared/components/badge";
import { Chip } from "@/shared/components/chip";
import { Tag } from "@/shared/components/tag";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <p className="font-tenada pt-4 text-5xl font-extrabold text-green-800">
        반갑습니다
      </p>
      <p className="font-sans text-6xl font-bold text-blue-400">세준님</p>
      <p className="text-6xl font-bold text-green-500">다연님</p>
      <AlertBadge>1</AlertBadge>
      <AlertBadge variant="sm">1</AlertBadge>
      <Chip>전체</Chip>
      <Chip variant="light">전체</Chip>
      <Chip variant="infomd">17:30</Chip>
      <Chip variant="infosm">17:30</Chip>
      <Chip variant="stateexp">이용 예정</Chip>
      <Chip variant="statewait">개설대기</Chip>
      <Chip variant="stateused">이용 완료</Chip>
      <Chip variant="statedone">개설확정</Chip>
      <Tag variant="md">오늘 21시 마감</Tag>
      <Tag variant="sm">오늘 21시 마감</Tag>
    </div>
  );
}
