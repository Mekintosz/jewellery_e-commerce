import { Link } from "react-router-dom";
import { useMemo } from "react";
import styles from "./WishlistPage.module.css";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../../components/product/ProductCard/ProductCard";

const WishlistPage = () => {
  const { items } = useWishlist();
  const { products } = useProducts();
  
  // Optimize lookups by using a Set for O(1) complexity instead of O(n)
  const wishlistIds = useMemo(() => new Set(items), [items]);
  
  const wishlistProducts = products.filter((product) =>
    wishlistIds.has(product.id),
  );

  return (
    <div className={styles.page}>
      <header className={styles["page__header"]}>
        <h1 className={styles["page__title"]}>Saved pieces</h1>
        <p className={styles["page__subtitle"]}>
          Keep track of jewellery you love for future occasions.
        </p>
      </header>
      {wishlistProducts.length === 0 ? (
        <div className={styles["page__empty"]}>
          <p>You have not saved any pieces yet.</p>
          <Link to="/products" className={styles["page__link"]}>
            Browse collections
          </Link>
        </div>
      ) : (
        <div className={styles["page__grid"]}>
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
