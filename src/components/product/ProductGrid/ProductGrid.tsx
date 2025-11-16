import styles from './ProductGrid.module.css';
import { ProductCard } from '../ProductCard/ProductCard';
import { Product } from '../../../types/product';

type ProductGridProps = {
  products: Product[];
  emptyState?: React.ReactNode;
};

export const ProductGrid = ({ products, emptyState }: ProductGridProps) => {
  if (products.length === 0) {
    return <div className={styles['product-grid__empty']}>{emptyState ?? <p>No products found.</p>}</div>;
  }

  return (
    <div className={styles['product-grid']}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
