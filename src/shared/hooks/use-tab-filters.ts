import type { Location, SortBy } from "@/shared/services/review/review.service";
import { MainPageSortBy } from "@/shared/services/gathering/gathering.service";
import { DallaemfitFilter } from "../types/filters";

export function useTabFilters<T extends SortBy | MainPageSortBy>(
  updateSearchParams: (updates: Record<string, string | null>) => void,
  currentTab: string
) {
  const handleTabChange = (tab: string) => {
    updateSearchParams({ tab, type: null });
  };

  const handleTypeFilterChange = (type: DallaemfitFilter) => {
    if (currentTab === "workation") return;
    updateSearchParams({ type: type === "all" ? null : type });
  };

  const handleLocationChange = (location: Location | "all") => {
    updateSearchParams({ location: location === "all" ? null : location });
  };

  const handleDateChange = (date: string | undefined) => {
    updateSearchParams({ date: date || null });
  };

  const handleSortChange = (sort: T | null) => {
    updateSearchParams({ sortBy: sort || null });
  };

  return {
    handleTabChange,
    handleTypeFilterChange,
    handleLocationChange,
    handleDateChange,
    handleSortChange,
  };
}