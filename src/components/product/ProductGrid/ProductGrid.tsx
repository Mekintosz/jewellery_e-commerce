import styles from "./ProductGrid.module.css";
import { ProductCard } from "../ProductCard/ProductCard";
import { Product } from "../../../types/product";
import { ProductSort } from "../ProductSort/ProductSort";

type ProductGridProps = {
  products: Product[];
  emptyState?: React.ReactNode;
  sortVisible?: boolean;
};

export const ProductGrid = ({
  products,
  emptyState,
  sortVisible = true,
}: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className={styles["product-grid__empty"]}>
        {emptyState ?? <p>No products found.</p>}
      </div>
    );
  }

  return (
    <div>
      {sortVisible && <ProductSort />}
      <div className={styles["product-grid"]}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
