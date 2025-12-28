import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductFilters } from "../types/product";
import {
  parseFiltersFromURL,
  buildURLFromFilters,
  areFiltersEqual,
} from "../utils/urlFilterSync";

/**
 * Custom hook to synchronize ProductFilters with URL search parameters
 * Handles bidirectional sync:
 * - URL changes (browser back/forward, manual edits) update filters
 * - Filter changes (UI interactions) update URL
 */
export const useURLFilters = (
  filters: ProductFilters,
  setFilters: (filters: ProductFilters | ((prev: ProductFilters) => ProductFilters)) => void,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const searchStringRef = useRef(searchParams.toString());
  const skipNextUrlWriteRef = useRef(false);

  // URL -> filters (for back/forward, manual edits, initial navigation)
  useEffect(() => {
    searchStringRef.current = searchParams.toString();

    const nextFilters = parseFiltersFromURL(searchParams);
    if (!areFiltersEqual(nextFilters, filtersRef.current)) {
      skipNextUrlWriteRef.current = true;
      setFilters(nextFilters);
    }
  }, [searchParams, setFilters]);

  // filters -> URL (for UI changes)
  useEffect(() => {
    if (skipNextUrlWriteRef.current) {
      skipNextUrlWriteRef.current = false;
      return;
    }

    const nextSearchParams = buildURLFromFilters(filters);
    const nextSearchString = nextSearchParams.toString();

    if (nextSearchString !== searchStringRef.current) {
      searchStringRef.current = nextSearchString;
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [filters, setSearchParams]);
};

