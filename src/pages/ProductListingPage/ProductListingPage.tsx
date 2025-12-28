import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useURLFilters } from "../../hooks/useURLFilters";
import {
  ActiveFilterToken,
  getActiveFilterTokens,
  countActiveFilters,
  getFilterTokenKey,
} from "../../utils/filterTokens";

const ITEMS_PER_BATCH = 9;

const ProductListingPage = () => {
  const { products, filteredProducts, filters, setFilters, isLoading } =
    useProducts();
  const { activeModal, openModal, closeModal } = useUI();

  // Synchronize filters with URL parameters
  useURLFilters(filters, setFilters);

  const maxPrice = useMemo(() => {
    const prices = products.map(
      (product) => product.salePrice ?? product.price,
    );
    return prices.length > 0 ? Math.max(...prices) : 10000;
  }, [products]);

  const priceIsActive =
    filters.priceRange[0] > 0 ||
    (Number.isFinite(filters.priceRange[1]) &&
      filters.priceRange[1] < maxPrice);

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters, priceIsActive),
    [filters, priceIsActive],
  );

  const activeFilters = useMemo(
    () => getActiveFilterTokens(filters, maxPrice, priceIsActive),
    [filters, maxPrice, priceIsActive],
  );

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

  // Reset visible count when filters change
  useEffect(() => {
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
              {activeFilters.map((filterToken) => (
                <button
                  key={getFilterTokenKey(filterToken)}
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
              ))}
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
