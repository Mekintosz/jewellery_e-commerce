import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductListingPage.module.css";
import { ProductFilter } from "../../components/product/ProductFilter/ProductFilter";
import { ProductGrid } from "../../components/product/ProductGrid/ProductGrid";
import { defaultFilters, useProducts } from "../../context/ProductContext";
import { Loader } from "../../components/ui/Loader/Loader";
import { Button } from "../../components/ui/Button/Button";
import { useUI } from "../../context/UIContext";
import { Modal } from "../../components/ui/Modal/Modal";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { Badge } from "../../components/ui/Badge/Badge";
import { ProductFilters } from "../../types/product";

const ITEMS_PER_BATCH = 9;

type ActiveFilterToken =
  | { kind: "query"; label: string }
  | { kind: "category"; value: string; label: string }
  | { kind: "inStock"; label: string }
  | { kind: "price"; label: string };

const areStringArraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const areFiltersEqual = (a: ProductFilters, b: ProductFilters) => {
  return (
    areStringArraysEqual(a.categories, b.categories) &&
    areStringArraysEqual(a.brands, b.brands) &&
    a.priceRange[0] === b.priceRange[0] &&
    a.priceRange[1] === b.priceRange[1] &&
    a.rating === b.rating &&
    a.inStockOnly === b.inStockOnly &&
    a.query === b.query &&
    areStringArraysEqual(a.tags, b.tags)
  );
};

const parseFiltersFromSearchParams = (
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

const buildSearchParamsFromFilters = (filters: ProductFilters) => {
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

const formatPrice = (value: number) => `$${Math.round(value).toLocaleString()}`;

const ProductListingPage = () => {
  const { products, filteredProducts, filters, setFilters, isLoading } =
    useProducts();
  const { activeModal, openModal, closeModal } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const searchStringRef = useRef(searchParams.toString());
  const skipNextUrlWriteRef = useRef(false);

  const maxPrice = useMemo(() => {
    const prices = products.map(
      (product) => product.salePrice ?? product.price,
    );
    return prices.length > 0 ? Math.max(...prices) : 10000;
  }, [products]);

  useEffect(() => {
    // URL -> filters (for back/forward, manual edits, initial navigation)
    searchStringRef.current = searchParams.toString();

    const nextFilters = parseFiltersFromSearchParams(searchParams);
    if (!areFiltersEqual(nextFilters, filtersRef.current)) {
      skipNextUrlWriteRef.current = true;
      setFilters(nextFilters);
    }
  }, [searchParams, setFilters]);

  useEffect(() => {
    // filters -> URL (for UI changes)
    if (skipNextUrlWriteRef.current) {
      skipNextUrlWriteRef.current = false;
      return;
    }

    const nextSearchParams = buildSearchParamsFromFilters(filters);
    const nextSearchString = nextSearchParams.toString();

    if (nextSearchString !== searchStringRef.current) {
      searchStringRef.current = nextSearchString;
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [filters, setSearchParams]);

  const priceIsActive =
    filters.priceRange[0] > 0 ||
    (Number.isFinite(filters.priceRange[1]) &&
      filters.priceRange[1] < maxPrice);

  const activeFilterCount = useMemo(() => {
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
  }, [
    filters.categories.length,
    filters.inStockOnly,
    filters.query,
    priceIsActive,
  ]);

  const activeFilters = useMemo<ActiveFilterToken[]>(() => {
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
  }, [
    filters.categories,
    filters.inStockOnly,
    filters.priceRange,
    filters.query,
    maxPrice,
    priceIsActive,
  ]);

  const handleRemoveActiveFilter = useCallback(
    (filterToken: ActiveFilterToken) => {
      setFilters((prev) => {
        switch (filterToken.kind) {
          case "query": {
            if (prev.query.trim().length === 0) {
              return prev;
            }
            return { ...prev, query: "" };
          }
          case "category": {
            if (!prev.categories.includes(filterToken.value)) {
              return prev;
            }
            return {
              ...prev,
              categories: prev.categories.filter(
                (category) => category !== filterToken.value,
              ),
            };
          }
          case "inStock": {
            if (!prev.inStockOnly) {
              return prev;
            }
            return { ...prev, inStockOnly: false };
          }
          case "price": {
            return { ...prev, priceRange: defaultFilters.priceRange };
          }
          default: {
            return prev;
          }
        }
      });
    },
    [setFilters],
  );

  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(ITEMS_PER_BATCH, filteredProducts.length),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < filteredProducts.length;

  useLayoutEffect(() => {
    setVisibleCount(Math.min(ITEMS_PER_BATCH, filteredProducts.length));
  }, [filters, filteredProducts.length]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const rangeStart = filteredProducts.length === 0 ? 0 : 1;
  const rangeEnd = Math.min(visibleCount, filteredProducts.length);

  const handleIntersect = useCallback(() => {
    setVisibleCount((prev) => {
      const next = Math.min(prev + ITEMS_PER_BATCH, filteredProducts.length);
      return prev === next ? prev : next;
    });
  }, [filteredProducts.length]);

  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: handleIntersect,
    enabled: hasMore && !isLoading,
    rootMargin: "200px",
  });

  return (
    <div className={styles.page}>
      <div className={styles["page__header"]}>
        <div>
          <h1 className={styles["page__title"]}>Fine Jewellery</h1>
          <p className={styles["page__subtitle"]}>
            {filteredProducts.length} pieces curated for you
          </p>
          {activeFilters.length > 0 ? (
            <div
              className={styles["page__active-filters"]}
              aria-label="Active filters"
            >
              {activeFilters.map((filterToken) => {
                const key =
                  filterToken.kind === "category"
                    ? `category:${filterToken.value}`
                    : filterToken.kind;

                return (
                  <button
                    key={key}
                    type="button"
                    className={styles["page__active-filterButton"]}
                    onClick={() => handleRemoveActiveFilter(filterToken)}
                    aria-label={`Remove filter: ${filterToken.label}`}
                  >
                    <Badge size="sm" className={styles["page__active-filter"]}>
                      <span>{filterToken.label}</span>
                      <span
                        className={styles["page__active-filter-remove"]}
                        aria-hidden="true"
                      >
                        ×
                      </span>
                    </Badge>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className={styles["page__actions"]}>
          <Button
            variant="secondary"
            size="sm"
            className={styles["page__filter-button"]}
            onClick={() => openModal("filter")}
          >
            Filter
            {activeFilterCount > 0 ? (
              <Badge size="sm" className={styles["page__filter-badge"]}>
                {activeFilterCount}
              </Badge>
            ) : null}
          </Button>
        </div>
      </div>

      <div className={styles["page__content"]}>
        <aside className={styles["page__sidebar"]}>
          <ProductFilter />
        </aside>
        <div className={styles["page__results"]}>
          {isLoading ? (
            <Loader variant="section" />
          ) : (
            <>
              <p className={styles["page__summary"]}>
                Showing {filteredProducts.length === 0 ? 0 : rangeStart}-
                {rangeEnd} of {filteredProducts.length} products
              </p>
              <ProductGrid
                products={paginatedProducts}
                emptyState={
                  <p className={styles["page__empty"]}>
                    No pieces match your current filters.
                  </p>
                }
              />
              <div
                ref={sentinelRef}
                className={styles["page__sentinel"]}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={activeModal === "filter"}
        onClose={closeModal}
        title="Filters"
        size="lg"
      >
        <ProductFilter />
      </Modal>
    </div>
  );
};

export default ProductListingPage;
