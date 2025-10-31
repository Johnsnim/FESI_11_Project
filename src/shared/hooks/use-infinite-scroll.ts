import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const { threshold = 0.1, rootMargin = "100px" } = options;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold, rootMargin }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold, rootMargin]);

  return observerTarget;
}