import { Link } from "react-router-dom";
import styles from "./ShoppingCartPage.module.css";
import { createVariantKey, useCart } from "../../context/CartContext";
import { CartItem } from "../../components/cart/CartItem/CartItem";
import { CartSummary } from "../../components/cart/CartSummary/CartSummary";

const ShoppingCartPage = () => {
  const { items } = useCart();

  return (
    <div className={styles.page}>
      <header className={styles["page__header"]}>
        <h1 className={styles["page__title"]}>Your bag</h1>
        <p className={styles["page__subtitle"]}>
          Secure checkout. Complimentary insured shipping worldwide.
        </p>
      </header>
      {items.length === 0 ? (
        <div className={styles["page__empty"]}>
          <p>Your bag is currently empty.</p>
          <Link to="/products" className={styles["page__link"]}>
            Explore our collections
          </Link>
        </div>
      ) : (
        <div className={styles["page__content"]}>
          <div className={styles["page__items"]}>
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${createVariantKey(item.variant)}`}
                item={item}
              />
            ))}
          </div>
          <aside className={styles["page__summary"]}>
            <CartSummary />
            <Link to="/checkout" className={styles["page__checkout"]}>
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
