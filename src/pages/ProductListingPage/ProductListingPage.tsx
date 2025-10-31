import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProductListingPage.module.css';
import { ProductFilter } from '../../components/product/ProductFilter/ProductFilter';
import { ProductSort } from '../../components/product/ProductSort/ProductSort';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid';
import { useProducts } from '../../context/ProductContext';
import { Loader } from '../../components/ui/Loader/Loader';
import { Button } from '../../components/ui/Button/Button';
import { useUI } from '../../context/UIContext';
import { Modal } from '../../components/ui/Modal/Modal';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const ITEMS_PER_BATCH = 9;

const ProductListingPage = () => {
  const { filteredProducts, isLoading } = useProducts();
  const { activeModal, openModal, closeModal } = useUI();
  const [visibleCount, setVisibleCount] = useState(() => Math.min(ITEMS_PER_BATCH, filteredProducts.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < filteredProducts.length;

  useEffect(() => {
    setVisibleCount(Math.min(ITEMS_PER_BATCH, filteredProducts.length));
  }, [filteredProducts.length]);

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

  useInfiniteScroll({ target: sentinelRef, onIntersect: handleIntersect, enabled: hasMore && !isLoading, rootMargin: '200px' });

  return (
    <div className={styles.page}>
      <div className={styles['page__header']}>
        <div>
          <h1 className={styles['page__title']}>Fine Jewellery</h1>
          <p className={styles['page__subtitle']}>{filteredProducts.length} pieces curated for you</p>
        </div>
        <div className={styles['page__actions']}>
          <ProductSort />
          <Button variant="secondary" size="sm" className={styles['page__filter-button']} onClick={() => openModal('filter')}>
            Filter
          </Button>
        </div>
      </div>

      <div className={styles['page__content']}>
        <aside className={styles['page__sidebar']}>
          <ProductFilter />
        </aside>
        <div className={styles['page__results']}>
          {isLoading ? (
            <Loader variant="section" />
          ) : (
            <>
              <p className={styles['page__summary']}>
                Showing {filteredProducts.length === 0 ? 0 : rangeStart}-{rangeEnd} of {filteredProducts.length} products
              </p>
              <ProductGrid
                products={paginatedProducts}
                emptyState={<p className={styles['page__empty']}>No pieces match your current filters.</p>}
              />
              <div ref={sentinelRef} className={styles['page__sentinel']} aria-hidden="true" />
            </>
          )}
        </div>
      </div>

      <Modal isOpen={activeModal === 'filter'} onClose={closeModal} title="Filters" size="lg">
        <ProductFilter />
      </Modal>
    </div>
  );
};

export default ProductListingPage;
