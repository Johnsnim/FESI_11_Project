"use client";

import { m } from "motion/react";

type ProgressBarProps = {
  cur: number;
  max: number;
};

export default function ProgressBar({ cur, max }: ProgressBarProps) {
  const percent =
    max > 0 ? Math.max(0, Math.min(100, Math.round((cur / max) * 100))) : 0;

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#EAEAEA]">
      <m.div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#17DA71] to-[#08DDF0]"
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        role="progressbar"
      />
    </div>
  );
}
