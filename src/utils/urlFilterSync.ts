import { ProductFilters } from "../types/product";
import { defaultFilters } from "../context/ProductContext";

/**
 * Parses ProductFilters from URL search parameters
 */
export const parseFiltersFromURL = (
  searchParams: URLSearchParams,
): ProductFilters => {
  const query = searchParams.get("query") ?? "";
  const categories = searchParams.getAll("category");
  const inStockOnly =
    searchParams.get("inStock") === "1" ||
    searchParams.get("inStock") === "true";

  const minPriceParam = Number(searchParams.get("minPrice"));
  const maxPriceParam = Number(searchParams.get("maxPrice"));

  const minPrice =
    Number.isFinite(minPriceParam) && minPriceParam > 0 ? minPriceParam : 0;
  const maxPriceValue =
    Number.isFinite(maxPriceParam) && maxPriceParam > 0
      ? maxPriceParam
      : Number.POSITIVE_INFINITY;

  const clampedMin = Number.isFinite(maxPriceValue)
    ? Math.min(minPrice, maxPriceValue)
    : minPrice;

  return {
    ...defaultFilters,
    categories,
    priceRange: [clampedMin, maxPriceValue],
    inStockOnly,
    query,
  };
};

/**
 * Builds URL search parameters from ProductFilters
 */
export const buildURLFromFilters = (filters: ProductFilters): URLSearchParams => {
  const params = new URLSearchParams();

  const query = filters.query.trim();
  if (query.length > 0) {
    params.set("query", query);
  }

  filters.categories.forEach((category) => params.append("category", category));

  if (filters.inStockOnly) {
    params.set("inStock", "1");
  }

  if (filters.priceRange[0] > 0) {
    params.set("minPrice", String(filters.priceRange[0]));
  }

  if (Number.isFinite(filters.priceRange[1])) {
    params.set("maxPrice", String(filters.priceRange[1]));
  }

  return params;
};

/**
 * Compares two string arrays for equality, ignoring order
 */
const areStringArraysEqualUnordered = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  
  return sortedA.every((value, index) => value === sortedB[index]);
};

/**
 * Compares two ProductFilters for equality
 * Uses order-insensitive comparison for array fields
 */
export const areFiltersEqual = (
  a: ProductFilters,
  b: ProductFilters,
): boolean => {
  return (
    areStringArraysEqualUnordered(a.categories, b.categories) &&
    areStringArraysEqualUnordered(a.brands, b.brands) &&
    areStringArraysEqualUnordered(a.tags, b.tags) &&
    a.priceRange[0] === b.priceRange[0] &&
    a.priceRange[1] === b.priceRange[1] &&
    a.rating === b.rating &&
    a.inStockOnly === b.inStockOnly &&
    a.query === b.query
  );
};

