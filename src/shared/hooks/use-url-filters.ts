// hooks/useUrlFilters.ts
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Location } from "@/shared/services/review/review.service";
import { DallaemfitFilter } from "../types/filters";

type LocationFilter = "all" | Location;

interface UseUrlFiltersOptions {
  basePath?: string;
}

export function useUrlFilters({ basePath = "/" }: UseUrlFiltersOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(
        queryString ? `${basePath}?${queryString}` : basePath,
        { scroll: false }
      );
    },
    [router, searchParams, basePath]
  );

  return {
    searchParams,
    updateSearchParams,
    currentTab: searchParams.get("tab") ?? "dallemfit",
    dallaemfitFilter: (searchParams.get("type") ?? "all") as DallaemfitFilter,
    selectedLocation: (searchParams.get("location") ?? "all") as LocationFilter,
    selectedDate: searchParams.get("date") ?? undefined,
  };
}