import * as React from "react";
import Image from "next/image";
import type { Gathering } from "@/shared/services/gathering/gathering.service";
import ProgressBar from "@/shared/components/progressbar";

type Participant = {
  userId: number;
  gatheringId: number;
  joinedAt: string;
  User: {
    id: number;
    email: string;
    name: string | null;
    companyName: string | null;
    image: string | null;
  };
};

type ParticipantsProps = {
  data: Gathering;
  participants: Participant[];
  isLoading: boolean;
};

function InitialsBubble({ name }: { name: string }) {
  const text = (name ?? "").trim();
  const initials =
    text.length === 0
      ? "?"
      : text
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-slate-600 ring-2 ring-white">
      {initials}
    </div>
  );
}

export default function Participants({
  data,
  participants,
  isLoading,
}: ParticipantsProps) {
  const MAX_AVATARS = 4;
  const visible = participants.slice(0, MAX_AVATARS);
  const extra = Math.max(0, data.participantCount - visible.length);

  return (
    <div className="mt-5 rounded-xl bg-gradient-to-r from-[#DEF8EA] to-[#e5f9f8] p-5">
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="flex flex-row items-center gap-2">
          <p className="font-medium">
            <span className="font-medium text-emerald-700">
              {data.participantCount}
            </span>
            명 참여
          </p>

          <div className="flex -space-x-2">
            {isLoading ? (
              Array.from({ length: MAX_AVATARS }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 animate-pulse rounded-full bg-zinc-200 ring-2 ring-white"
                />
              ))
            ) : (
              <>
                {visible.map((p) => {
                  const key = `${p.userId}-${p.joinedAt}`;
                  const img = p.User.image;
                  const name = p.User.name || p.User.email || "참여자";
                  return img ? (
                    <Image
                      key={key}
                      src={img}
                      alt={name}
                      width={28}
                      height={28}
                      quality={75}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <InitialsBubble key={key} name={name} />
                  );
                })}
                {extra > 0 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium ring-2 ring-white">
                    +{extra}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-1">
          <Image src="/image/ic_check_sm.svg" alt="check" width={8} height={8}/>
          <p className="font-medium text-green-600">개설확정</p>
        </div>
      </div>

      <div className="mt-4 mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>최소 {data.capacity}명</span>
        <span>최대 {data.capacity}명</span>
      </div>

      <ProgressBar cur={data.participantCount} max={data.capacity} />
    </div>
  );
}