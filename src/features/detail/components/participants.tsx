"use client";

import * as React from "react";
import type {
  Gathering,
  GatheringParticipant,
} from "@/shared/services/gathering/gathering.service";

type Props = {
  data: Gathering;
  participants?: GatheringParticipant[];
  loading?: boolean;
};

function Initials({ name }: { name: string }) {
  const text = name?.trim() || "";
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
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 ring-2 ring-white">
      {initials}
    </div>
  );
}

export default function Participants({
  data,
  participants = [],
  loading = false,
}: Props) {
  const { participantCount, capacity } = data;
  const percent =
    capacity > 0
      ? Math.min(100, Math.round((participantCount / capacity) * 100))
      : 0;

  const maxAvatars = 8;
  const visible = participants.slice(0, maxAvatars);
  const extra = Math.max(0, participantCount - visible.length);

  return (
    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">참여자</h2>
        <span className="text-sm font-medium text-gray-600 tabular-nums">
          <span className="text-green-600">{participantCount}</span>/{capacity}
        </span>
      </div>

      {/* 아바타 리스트 */}
      <div className="mt-3">
        {loading ? (
          <div className="flex -space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 animate-pulse rounded-full bg-zinc-200 ring-2 ring-white"
              />
            ))}
          </div>
        ) : participantCount === 0 ? (
          <p className="text-sm text-gray-500">아직 참여자가 없어요.</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {visible.map((p) => {
                const img = p.User.image;
                const name = p.User.name || p.User.email || "참여자";
                return img ? (
                  <img
                    key={`${p.userId}-${p.joinedAt}`}
                    src={img}
                    alt={name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <Initials key={`${p.userId}-${p.joinedAt}`} name={name} />
                );
              })}
              {extra > 0 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-2 ring-white">
                  +{extra}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 진행 바 */}
      <div className="mt-4 flex w-full items-center">
        <svg
          className="mr-2 h-5 w-5 shrink-0 text-slate-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z
               M4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z"
          />
        </svg>
        <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
