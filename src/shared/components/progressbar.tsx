"use client";

import * as React from "react";

export function ProgressBar({ ratio }: { ratio: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return (
    <div className="w-full rounded-full bg-emerald-100 p-1">
      <div
        className="h-2 rounded-full bg-emerald-500 transition-[width]"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}
