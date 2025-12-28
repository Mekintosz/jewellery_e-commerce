import { Link } from "react-router-dom";
import styles from "./MiniCart.module.css";
import { useCart, createVariantKey } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/currency";
import { formatVariantLabel } from "../utils";

type MiniCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MiniCart = ({ isOpen, onClose }: MiniCartProps) => {
  const { items, summary, updateQuantity, removeItem } = useCart();

  return (
    <aside
      className={`${styles["mini-cart"]} ${isOpen ? styles["mini-cart--open"] : ""}`}
      aria-hidden={!isOpen}
    >
      <div className={styles["mini-cart__header"]}>
        <h2 className={styles["mini-cart__title"]}>Your Bag</h2>
        <button
          type="button"
          className={styles["mini-cart__close"]}
          onClick={onClose}
          aria-label="Close mini cart"
        >
          ✕
        </button>
      </div>
      <div className={styles["mini-cart__content"]}>
        {items.length === 0 ? (
          <p className={styles["mini-cart__empty"]}>
            Your cart is currently empty.
          </p>
        ) : (
          <ul className={styles["mini-cart__list"]}>
            {items.map((item) => {
              const variantKey = createVariantKey(item.variant);
              const variantLabel = formatVariantLabel(item.variant);
              const isDecreaseDisabled = item.quantity <= 1;
              const isIncreaseDisabled = item.quantity >= item.maxQuantity;
              const handleDecrease = () => {
                if (isDecreaseDisabled) {
                  return;
                }
                updateQuantity(item.productId, variantKey, item.quantity - 1);
              };
              const handleIncrease = () => {
                if (isIncreaseDisabled) {
                  return;
                }
                updateQuantity(item.productId, variantKey, item.quantity + 1);
              };

              return (
                <li
                  key={`${item.productId}-${variantKey}`}
                  className={styles["mini-cart__item"]}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles["mini-cart__image"]}
                    loading="lazy"
                  />
                  <div className={styles["mini-cart__details"]}>
                    <p className={styles["mini-cart__name"]}>{item.name}</p>
                    {variantLabel ? (
                      <p className={styles["mini-cart__variant"]}>
                        {variantLabel}
                      </p>
                    ) : null}
                    <div className={styles["mini-cart__controls"]}>
                      <div className={styles["mini-cart__quantity"]}>
                        <button
                          type="button"
                          disabled={isDecreaseDisabled}
                          onClick={handleDecrease}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          disabled={isIncreaseDisabled}
                          onClick={handleIncrease}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles["mini-cart__remove"]}
                        onClick={() => removeItem(item.productId, variantKey)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className={styles["mini-cart__price"]}>
                    {formatCurrency(item.salePrice ?? item.price)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className={styles["mini-cart__footer"]}>
        <div className={styles["mini-cart__summary"]}>
          <span>Subtotal</span>
          <strong>{formatCurrency(summary.subtotal)}</strong>
        </div>
        <Link
          to="/cart"
          className={`${styles["mini-cart__checkout"]} ${items.length === 0 ? styles["mini-cart__checkout--disabled"] : ""}`}
          onClick={() => {
            if (items.length > 0) {
              onClose();
            }
          }}
          aria-disabled={items.length === 0}
        >
          View bag &amp; checkout
        </Link>
      </div>
    </aside>
  );
};
