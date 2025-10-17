"use client";

type SkeletonProps = { className?: string };

function Block({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={["animate-pulse rounded bg-gray-200", className].join(" ")}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="mb-5 box-border w-full justify-center overflow-hidden rounded-3xl px-4 md:flex md:h-fit md:flex-row md:items-center md:justify-center md:bg-white md:p-6">
      <div className="relative flex h-39 w-full items-center justify-center rounded-t-3xl bg-[#EDEDED] md:aspect-square md:size-45 md:shrink-0 md:rounded-3xl md:rounded-l-3xl">
        <Block className="h-full w-full rounded-t-3xl md:rounded-3xl md:rounded-l-3xl" />
      </div>

      <div className="w-full rounded-b-3xl bg-white p-4 md:min-w-0 md:flex-1 md:rounded-r-3xl md:rounded-bl-none md:pt-0 md:pr-0 md:pb-0">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <Block className="h-6 w-44" />
              <Block className="h-6 w-16 rounded-2xl" />
            </div>

            <div className="mt-2 h-5 w-40">
              <Block className="h-5 w-32" />
            </div>

            <div className="mt-3 flex items-center gap-2 md:hidden">
              <Block className="h-7 w-20 rounded-2xl" />
              <Block className="h-7 w-16 rounded-2xl" />
              <Block className="h-7 w-28 rounded-2xl" />
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-1 border-gray-100">
            <Block className="h-6 w-6 rounded-full" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:mt-7 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 flex-col">
            <div className="hidden items-center gap-2 md:mt-2 md:mb-3 md:flex">
              <Block className="h-7 w-20 rounded-2xl" />
              <Block className="h-7 w-16 rounded-2xl" />
              <Block className="h-7 w-28 rounded-2xl" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center">
                <Block className="mr-2 h-5 w-5 rounded-full" />
                <div className="relative ml-1 h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#EAEAEA]">
                  <div
                    className="absolute bottom-0 left-0 animate-pulse rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300"
                    style={{ width: "30%" }}
                  />
                </div>
                <Block className="ml-2 h-4 w-14 md:ml-3" />
              </div>

              <div className="shrink-0 rounded-2xl border-1 border-green-200 px-6 py-2.5 md:hidden">
                <Block className="h-5 w-16 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl border-1 border-green-200 px-6 py-2.5 md:block md:self-end">
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
