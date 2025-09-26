import React from "react";

export default function RatingHearts({
  value = 0,
  max = 5,
}: {
  value?: number;
  max?: number;
}) {
  const USED_MAX = Math.min(max ?? 5, 5);
  const filled = Math.max(0, Math.min(Math.floor(value ?? 0), USED_MAX));

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`평점 ${filled}/${USED_MAX}`}
    >
      {Array.from({ length: USED_MAX }, (_, i) => (
        <img
          key={i}
          src={
            i < filled
              ? "/image/ic_heart_fill.svg"
              : "/image/ic_heart_empty.svg"
          }
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
          loading="lazy"
        />
      ))}
    </div>
  );
}
