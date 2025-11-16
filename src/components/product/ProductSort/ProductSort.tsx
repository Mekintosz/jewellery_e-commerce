import styles from './ProductSort.module.css';
import { useProducts } from '../../../context/ProductContext';

export const ProductSort = () => {
  const { sortBy, setSort } = useProducts();

  return (
    <div className={styles.sort}>
      <label className={styles['sort__label']} htmlFor="sort">
        Sort by
      </label>
      <select
        id="sort"
        className={styles['sort__select']}
        value={sortBy}
        onChange={(event) => setSort(event.target.value as typeof sortBy)}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top rated</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};
