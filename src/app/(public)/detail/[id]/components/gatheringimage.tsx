import React from "react";
import type { GatheringDetail } from "../types";
import Image from "next/image";

export default function GatheringImage({ data }: { data: GatheringDetail }) {
  return (
    <div className="aspect-auto flex-1 overflow-hidden rounded-2xl md:items-stretch">
      <Image
        src={data.image || "/placeholder-image.jpg"}
        alt={data.name}
        className="h-fit max-h-85 w-full object-cover"
      />
    </div>
  );
}
