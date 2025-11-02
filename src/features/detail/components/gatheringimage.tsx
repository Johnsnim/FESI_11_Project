import React from "react";
import type { Gathering } from "@/shared/services/gathering/gathering.service";
import Image from "next/image";

export default function GatheringImage({ data }: { data: Gathering }) {
  const hasImage = !!data.image;

  return (
    <div className="relative min-h-64 w-full flex-1 overflow-hidden rounded-2xl bg-[#9DEBCD] md:h-87">
      {hasImage ? (
        <Image
          src={data.image as string}
          alt={data.name}
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="top-17 right-6 max-h-full w-[90%] object-contain">
          <Image src="/image/img_banner_lg.svg" alt="배너" fill />
        </div>
      )}
    </div>
  );
}
