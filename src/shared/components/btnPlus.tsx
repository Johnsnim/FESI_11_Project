"use client";

import { Button } from "@/shadcn/button";
import { m } from "motion/react";

type Props = React.ComponentProps<typeof Button> & { label?: string };

export default function ButtonPlus({
  label = "모임 만들기",
  className = "",
  ...props
}: Props) {
  const base =
    "cursor-pointer fixed right-5 bottom-5 h-12 w-12 rounded-full bg-green-500 p-0 text-white text-xl font-bold tracking-[-0.03em] hover:bg-green-700 sm:rounded-6 md:h-16 md:w-48.5 z-999";
  return (
    <Button {...props} className={[base, className].join(" ")}>
      <m.div
        className="flex h-full w-full items-center justify-center gap-1 md:pr-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <img src="/image/ic_plus.svg" alt="plus" width={32} height={32} />
        <span className="hidden md:inline">{label}</span>
      </m.div>
    </Button>
  );
}
