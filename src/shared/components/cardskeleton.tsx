"use client";

type SkeletonProps = { className?: string };

function Block({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="mb-5 box-border h-86.5 w-full justify-center overflow-hidden px-4 md:flex md:h-fit md:flex-row md:items-center md:justify-center md:bg-white">
      <div className="flex h-39 w-full items-center justify-center rounded-t-3xl bg-[#EDEDED] md:aspect-square md:size-42 md:shrink-0 md:rounded-3xl md:rounded-l-3xl">
        <Block className="h-full w-full rounded-t-3xl md:rounded-3xl md:rounded-l-3xl" />
      </div>

      <div className="h-full w-full overflow-hidden rounded-b-3xl bg-white p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none">
        <div className="flex flex-row justify-between">
          <div className="min-w-0">
            <div className="flex flex-row items-center gap-2">
              <Block className="h-6 w-44" />
              <Block className="h-6 w-16 rounded-2xl" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Block className="h-5 w-10" />
              <Block className="h-5 w-20" />
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-1 border-gray-100">
            <Block className="h-6 w-6 rounded-full" />
          </div>
        </div>

        <div className="mt-3.5 flex flex-row items-center gap-2 md:mt-7">
          <Block className="h-7 w-20 rounded-2xl" />
          <Block className="h-7 w-14 rounded-2xl" />
          <Block className="h-7 w-28 rounded-2xl" />
        </div>

        <div className="mt-4 flex flex-row items-center md:mt-1">
          <div className="flex w-full flex-row items-center">
            <Block className="mr-2 h-5 w-5 rounded-full" />
            <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="absolute inset-y-0 left-0 animate-pulse rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300"
                style={{ width: "25%" }}
              />
            </div>
            <Block className="ml-2 h-4 w-12" />
          </div>
          <div className="ml-2 rounded-2xl border-1 border-green-200 px-2.5 py-2">
            <Block className="h-5 w-16 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
