import { useMemo } from "react";
import styles from "./ProductFilter.module.css";
import { defaultFilters, useProducts } from "../../../context/ProductContext";
import { Button } from "../../ui/Button/Button";

const formatPrice = (value: number) => {
  if (!Number.isFinite(value)) {
    return "∞";
  }
  return `$${Math.round(value).toLocaleString()}`;
};

export const ProductFilter = () => {
  const { products, filters, setFilters } = useProducts();

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );

  const maxPrice = useMemo(() => {
    const prices = products.map(
      (product) => product.salePrice ?? product.price,
    );
    return prices.length > 0 ? Math.max(...prices) : 10000;
  }, [products]);

  const maxSliderValue = useMemo(() => {
    const explicitMax = Number.isFinite(filters.priceRange[1])
      ? filters.priceRange[1]
      : 0;
    return Math.max(maxPrice, filters.priceRange[0], explicitMax);
  }, [filters.priceRange, maxPrice]);

  const displayedMaxPrice = Number.isFinite(filters.priceRange[1])
    ? filters.priceRange[1]
    : Math.max(maxPrice, filters.priceRange[0]);

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((item) => item !== category)
          : [...prev.categories, category],
      };
    });
  };

  const toggleInStockOnly = () => {
    setFilters((prev) => ({
      ...prev,
      inStockOnly: !prev.inStockOnly,
    }));
  };

  const handleMinPriceChange = (nextMinRaw: number) => {
    setFilters((prev) => {
      const currentMax = Number.isFinite(prev.priceRange[1])
        ? prev.priceRange[1]
        : Number.POSITIVE_INFINITY;
      const nextMin = Math.min(nextMinRaw, currentMax);
      return {
        ...prev,
        priceRange: [nextMin, prev.priceRange[1]],
      };
    });
  };

  const handleMaxPriceChange = (nextMaxRaw: number) => {
    setFilters((prev) => {
      const nextMaxFinite = Math.max(nextMaxRaw, prev.priceRange[0]);
      const nextMax =
        nextMaxFinite === maxPrice ? Number.POSITIVE_INFINITY : nextMaxFinite;
      return {
        ...prev,
        priceRange: [prev.priceRange[0], nextMax],
      };
    });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <aside className={styles.filter}>
      <div className={styles["filter__header"]}>
        <h2 className={styles["filter__title"]}>Filter</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <section className={styles["filter__section"]}>
        <h3 className={styles["filter__heading"]}>Categories</h3>
        <ul className={styles["filter__list"]}>
          {categories.map((category) => {
            const isActive = filters.categories.includes(category);
            return (
              <li key={category}>
                <button
                  type="button"
                  className={`${styles["filter__option"]} ${isActive ? styles["filter__option--active"] : ""}`}
                  onClick={() => toggleCategory(category)}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles["filter__section"]}>
        <h3 className={styles["filter__heading"]}>Availability</h3>
        <button
          type="button"
          className={`${styles["filter__option"]} ${filters.inStockOnly ? styles["filter__option--active"] : ""}`}
          onClick={toggleInStockOnly}
          aria-pressed={filters.inStockOnly}
        >
          In stock only
        </button>
      </section>

      <section className={styles["filter__section"]}>
        <h3 className={styles["filter__heading"]}>Price</h3>
        <div className={styles["filter__price"]}>
          <div className={styles["filter__price-values"]}>
            <span>Min: {formatPrice(filters.priceRange[0])}</span>
            <span>Max: {formatPrice(displayedMaxPrice)}</span>
          </div>

          <label className={styles["filter__range"]}>
            <span className={styles["filter__range-label"]}>Min</span>
            <input
              className={styles["filter__range-input"]}
              type="range"
              min={0}
              max={maxSliderValue}
              step={50}
              value={filters.priceRange[0]}
              onChange={(event) =>
                handleMinPriceChange(Number(event.target.value))
              }
            />
          </label>

          <label className={styles["filter__range"]}>
            <span className={styles["filter__range-label"]}>Max</span>
            <input
              className={styles["filter__range-input"]}
              type="range"
              min={0}
              max={maxSliderValue}
              step={50}
              value={displayedMaxPrice}
              onChange={(event) =>
                handleMaxPriceChange(Number(event.target.value))
              }
            />
          </label>
        </div>
      </section>
    </aside>
  );
};
