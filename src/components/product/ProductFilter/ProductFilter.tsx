import { useEffect, useMemo, useState } from 'react';
import styles from './ProductFilter.module.css';
import { useProducts } from '../../../context/ProductContext';
import { Button } from '../../ui/Button/Button';
import { useUI } from '../../../context/UIContext';

export const ProductFilter = () => {
  const { products, filters, setFilters } = useProducts();
  const { closeModal } = useUI();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))).sort(), [products]);

  const priceOptions: Array<{ label: string; range: [number, number] }> = [
    { label: 'All', range: [0, 10000] },
    { label: '$0 - $250', range: [0, 250] },
    { label: '$250 - $500', range: [250, 500] },
    { label: '$500+', range: [500, 10000] }
  ];

  const toggleFilterValue = (key: 'categories' | 'brands' | 'tags', value: string) => {
    setLocalFilters((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    closeModal();
  };

  const clearFilters = () => {
    const clearedFilters = {
      ...localFilters,
      categories: [],
      brands: [],
      priceRange: [0, 10000] as [number, number],
      inStockOnly: false,
      tags: []
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <aside className={styles.filter}>
      <div className={styles['filter__header']}>
        <h2 className={styles['filter__title']}>Filter</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <section className={styles['filter__section']}>
        <h3 className={styles['filter__heading']}>Categories</h3>
        <ul className={styles['filter__list']}>
          {categories.map((category) => {
            const isActive = localFilters.categories.includes(category);
            return (
              <li key={category}>
                <button
                  type="button"
                  className={`${styles['filter__option']} ${isActive ? styles['filter__option--active'] : ''}`}
                  onClick={() => toggleFilterValue('categories', category)}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles['filter__section']}>
        <h3 className={styles['filter__heading']}>Brands</h3>
        <ul className={styles['filter__list']}>
          {brands.map((brand) => {
            const isActive = localFilters.brands.includes(brand);
            return (
              <li key={brand}>
                <button
                  type="button"
                  className={`${styles['filter__option']} ${isActive ? styles['filter__option--active'] : ''}`}
                  onClick={() => toggleFilterValue('brands', brand)}
                  aria-pressed={isActive}
                >
                  {brand}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles['filter__section']}>
        <h3 className={styles['filter__heading']}>Availability</h3>
        <button
          type="button"
          className={`${styles['filter__option']} ${localFilters.inStockOnly ? styles['filter__option--active'] : ''}`}
          onClick={() => setLocalFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
          aria-pressed={localFilters.inStockOnly}
        >
          In stock only
        </button>
      </section>

      <section className={styles['filter__section']}>
        <h3 className={styles['filter__heading']}>Price</h3>
        <ul className={styles['filter__list']}>
          {priceOptions.map((option) => {
            const isActive =
              option.range[0] === localFilters.priceRange[0] && option.range[1] === localFilters.priceRange[1];
            return (
              <li key={option.label}>
                <button
                  type="button"
                  className={`${styles['filter__option']} ${isActive ? styles['filter__option--active'] : ''}`}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceRange: option.range
                    }))
                  }
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Button variant="primary" isFullWidth onClick={applyFilters}>
        Apply filters
      </Button>
    </aside>
  );
};
