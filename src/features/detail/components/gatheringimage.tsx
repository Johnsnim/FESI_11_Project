import React from "react";
import type { Gathering } from "@/shared/services/gathering/gathering.service";

export default function GatheringImage({ data }: { data: Gathering }) {
  const hasImage = !!data.image;

  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#9DEBCD]">
      {hasImage ? (
        <img
          src={data.image as string}
          alt={data.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src="/image/img_banner_lg.svg"
          alt="배너"
          className="absolute top-16 right-0 max-h-full w-[90%] object-contain"
        />
      )}
    </div>
  );
}
