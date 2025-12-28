import { ProductFilters } from "../types/product";

export type ActiveFilterToken =
  | { kind: "query"; label: string }
  | { kind: "category"; value: string; label: string }
  | { kind: "inStock"; label: string }
  | { kind: "price"; label: string };

const formatPrice = (value: number) => `$${Math.round(value).toLocaleString()}`;

/**
 * Generates active filter tokens for display
 */
export const getActiveFilterTokens = (
  filters: ProductFilters,
  maxPrice: number,
  priceIsActive: boolean,
): ActiveFilterToken[] => {
  const tokens: ActiveFilterToken[] = [];

  const query = filters.query.trim();
  if (query.length > 0) {
    tokens.push({ kind: "query", label: `Search: ${query}` });
  }

  if (filters.categories.length > 0) {
    filters.categories.forEach((category) => {
      tokens.push({ kind: "category", value: category, label: category });
    });
  }

  if (filters.inStockOnly) {
    tokens.push({ kind: "inStock", label: "In stock" });
  }

  if (priceIsActive) {
    const maxDisplay = Number.isFinite(filters.priceRange[1])
      ? filters.priceRange[1]
      : maxPrice;

    tokens.push({
      kind: "price",
      label: `Price: ${formatPrice(filters.priceRange[0])} - ${formatPrice(
        maxDisplay,
      )}`,
    });
  }

  return tokens;
};

/**
 * Counts active filters (grouped by type)
 */
export const countActiveFilters = (
  filters: ProductFilters,
  priceIsActive: boolean,
): number => {
  let count = 0;

  if (filters.categories.length > 0) {
    count += 1;
  }

  if (priceIsActive) {
    count += 1;
  }

  if (filters.inStockOnly) {
    count += 1;
  }

  if (filters.query.trim().length > 0) {
    count += 1;
  }

  return count;
};

/**
 * Generates a unique key for a filter token
 */
export const getFilterTokenKey = (filterToken: ActiveFilterToken): string => {
  return filterToken.kind === "category"
    ? `category:${filterToken.value}`
    : filterToken.kind;
};

