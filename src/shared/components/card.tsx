import { Chip } from "./chip";
import { Tag } from "./tag";
import { motion } from "motion/react";

type CardProps = {
  title: string;
  location: string;
  dateTimeISO: string;
  registrationEndISO?: string | null;
  participantCount: number;
  capacity: number;
  image?: string | null;
  isCanceled?: boolean;
};

export default function Card() {
  return (
    <div className="mb-5 box-border h-86.5 w-full justify-center overflow-hidden px-4 md:flex md:h-fit md:flex-row md:items-center md:justify-center md:bg-white">
      {/* 상단 이미지 자리 */}
      <div className="flex h-39 w-full items-center justify-center rounded-t-3xl bg-[#EDEDED] md:aspect-square md:size-42 md:shrink-0 md:rounded-3xl md:rounded-l-3xl">
        이미지 들어갈 자리
      </div>
      {/* 하단 설명 자리 */}
      <div className="h-full w-full overflow-hidden rounded-b-3xl bg-white p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none">
        {/* 최상단 제목 + 위치 */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 align-middle">
              <p className="text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800">
                달램핏 오피스 스트레칭
              </p>
              <Chip variant="statedone" icon="/image/ic_check_md.svg">
                개설확정
              </Chip>
            </div>

            <p className="text-md mt-1.5 leading-7 font-medium tracking-[-0.03em] text-gray-400">
              위치
              <span className="pl-2 text-gray-500">을지로 3가</span>
            </p>
          </div>
          {/* 하트버튼 */}
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100">
            <img
              src="/image/ic_heart_empty.svg"
              alt="heart button"
              className="h-6 w-6"
            />
          </div>
        </div>

        {/* chip + 태그 들어가는 자리 */}
        <div className="mt-3.5 flex flex-row items-center gap-2 md:mt-7">
          <Chip variant="infomd">1월 7일</Chip>
          <Chip variant="infomd">17:30</Chip>
          <Tag variant="md" icon="/image/ic_alarm.svg">
            오늘 21시 마감
          </Tag>
        </div>

        {/* 인원 수 바 + 참여하기 버튼 */}
        <div className="mt-4 flex flex-row items-center md:mt-1">
          <div className="flex w-full flex-row items-center">
            <img
              src="/image/ic_person.svg"
              alt="person icon"
              className="mr-2"
            />
            <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                initial={{ width: 0 }}
                whileInView={{ width: `25%` }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600 tabular-nums">
              <span className="text-green-500">4</span>/20
            </span>
          </div>
          {/* 참여하기 버튼 */}
          <div className="ml-2 flex items-center justify-center rounded-2xl border-1 border-green-500">
            <p className="px-2.5 py-2 font-semibold whitespace-nowrap text-green-500">
              참여하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// API 달면 주석 풀고 위 코드 제거할것
// export default function Card({
//   title,
//   location,
//   dateTimeISO,
//   registrationEndISO,
//   participantCount,
//   capacity,
//   image,
//   isCanceled,
// }: CardProps) {
//   const start = new Date(dateTimeISO);
//   const dateLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
//   const timeLabel = start
//     .toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
//     .replace(/^0/, "");

//   const now = new Date();
//   const regEnd = registrationEndISO ? new Date(registrationEndISO) : null;
//   const isToday =
//     regEnd &&
//     now.getFullYear() === regEnd.getFullYear() &&
//     now.getMonth() === regEnd.getMonth() &&
//     now.getDate() === regEnd.getDate();

//   const regEndTime = regEnd
//     ? regEnd.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(/^0/, "")
//     : null;

//   const tagText = regEndTime ? `${isToday ? "오늘 " : ""}${regEndTime} 마감` : "마감일 미정";

//   const percent =
//     capacity > 0 ? Math.min(100, Math.round((participantCount / capacity) * 100)) : 0;

//   const statusText = isCanceled ? "취소됨" : regEnd && regEnd < now ? "마감" : "개설확정";

//   return (
//     <div className="mb-5 box-border h-86.5 w-full justify-center overflow-hidden px-4 md:flex md:h-fit md:flex-row md:items-center md:justify-center md:bg-white">
//       {/* 상단 이미지 자리 */}
//       <div className="flex h-39 w-full items-center justify-center rounded-t-3xl bg-[#EDEDED] md:aspect-square md:size-42 md:shrink-0 md:rounded-3xl md:rounded-l-3xl">
//         {image ? (
//           <img src={image} alt={title} className="h-full w-full object-cover rounded-t-3xl md:rounded-3xl md:rounded-l-3xl" />
//         ) : (
//           "이미지 들어갈 자리"
//         )}
//       </div>
//       {/* 하단 설명 자리 */}
//       <div className="h-full w-full overflow-hidden rounded-b-3xl bg-white p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none">
//         {/* 최상단 제목 + 위치 */}
//         <div className="flex flex-row justify-between">
//           <div className="flex flex-col">
//             <div className="flex flex-row gap-2 align-middle">
//               <p className="text-xl leading-7 font-semibold tracking-[-0.03em] text-gray-800">
//                 {title}
//               </p>
//               <Chip variant="statedone" icon="/image/ic_check_md.svg">
//                 {statusText}
//               </Chip>
//             </div>

//             <p className="text-md mt-1.5 leading-7 font-medium tracking-[-0.03em] text-gray-400">
//               위치
//               <span className="pl-2 text-gray-500">{location}</span>
//             </p>
//           </div>
//           {/* 하트버튼 */}
//           <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-1 border-gray-100">
//             <img
//               src="/image/ic_heart_empty.svg"
//               alt="heart button"
//               className="h-6 w-6"
//             />
//           </div>
//         </div>

//         {/* chip + 태그 들어가는 자리 */}
//         <div className="mt-3.5 flex flex-row items-center gap-2 md:mt-7">
//           <Chip variant="infomd">{dateLabel}</Chip>
//           <Chip variant="infomd">{timeLabel}</Chip>
//           <Tag variant="md" icon="/image/ic_alarm.svg">
//             {tagText}
//           </Tag>
//         </div>

//         {/* 인원 수 바 + 참여하기 버튼 */}
//         <div className="mt-4 flex flex-row items-center md:mt-1">
//           <div className="flex w-full flex-row items-center">
//             <img
//               src="/image/ic_person.svg"
//               alt="person icon"
//               className="mr-2"
//             />
//             <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
//               <motion.div
//                 className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
//                 initial={{ width: 0 }}
//                 whileInView={{ width: `${percent}%` }}
//                 viewport={{ once: true, amount: 1 }}
//                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
//               />
//             </div>
//             <span className="ml-2 text-sm font-medium text-gray-600 tabular-nums">
//               <span className="text-green-500">{participantCount}</span>/{capacity}
//             </span>
//           </div>
//           {/* 참여하기 버튼 */}
//           <div className="ml-2 flex items-center justify-center rounded-2xl border-1 border-green-500">
//             <p className="px-2.5 py-2 font-semibold whitespace-nowrap text-green-500">
//               참여하기
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
