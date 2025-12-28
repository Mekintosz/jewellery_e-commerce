import styles from "./CartItem.module.css";
import { CartItem as CartItemType } from "../../../types/cart";
import { createVariantKey, useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/currency";
import { formatVariantLabel } from "../utils";

type CartItemProps = {
  item: CartItemType;
};

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const key = createVariantKey(item.variant);
  const variantLabel = formatVariantLabel(item.variant);
  const isDecreaseDisabled = item.quantity <= 1;
  const isIncreaseDisabled = item.quantity >= item.maxQuantity;
  const handleDecrease = () => {
    if (isDecreaseDisabled) {
      return;
    }
    updateQuantity(item.productId, key, item.quantity - 1);
  };
  const handleIncrease = () => {
    if (isIncreaseDisabled) {
      return;
    }
    updateQuantity(item.productId, key, item.quantity + 1);
  };

  return (
    <article className={styles["cart-item"]}>
      <img
        src={item.image}
        alt={item.name}
        className={styles["cart-item__image"]}
        loading="lazy"
      />
      <div className={styles["cart-item__details"]}>
        <h3 className={styles["cart-item__name"]}>{item.name}</h3>
        {variantLabel ? (
          <p className={styles["cart-item__variant"]}>{variantLabel}</p>
        ) : null}
        <div className={styles["cart-item__controls"]}>
          <div className={styles["cart-item__quantity"]}>
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
            className={styles["cart-item__remove"]}
            onClick={() => removeItem(item.productId, key)}
          >
            Remove
          </button>
        </div>
      </div>
      <div className={styles["cart-item__pricing"]}>
        <p className={styles["cart-item__price"]}>
          {formatCurrency(item.salePrice ?? item.price)}
        </p>
      </div>
    </article>
  );
};
