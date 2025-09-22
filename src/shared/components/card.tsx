import { Chip } from "./chip";

export default function Card() {
  return (
    <div className="box-border h-86.5 w-full overflow-hidden px-4">
      <div className="h-39 w-full rounded-t-3xl bg-[#EDEDED]">
        상단이미지들어갈자리
      </div>
      <div className="h-full w-full rounded-b-3xl bg-white p-4">
        <div>
          <p className="text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800">
            달램핏 오피스 스트레칭
          </p>

          <p className="text-md mt-1.5 leading-7 font-medium tracking-[-0.03em] text-gray-400">
            위치
            <span className="pl-2 text-gray-500">을지로 3가</span>
          </p>

          <Chip>1월 7일</Chip>
          <Chip>17:30</Chip>
          <Chip>오늘 21시 마감</Chip>
        </div>
      </div>
    </div>
  );
}
