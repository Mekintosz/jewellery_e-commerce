import styles from "./CartItem.module.css";
import { CartItem as CartItemType } from "../../../types/cart";
import { createVariantKey, useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/currency";

type CartItemProps = {
  item: CartItemType;
};

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const key = createVariantKey(item.variant);

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
        <p className={styles["cart-item__variant"]}>
          {item.variant.size ? `Size: ${item.variant.size}` : null}
          {item.variant.color ? ` · Color: ${item.variant.color}` : null}
        </p>
        <div className={styles["cart-item__controls"]}>
          <div className={styles["cart-item__quantity"]}>
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, key, item.quantity - 1)
              }
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, key, item.quantity + 1)
              }
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
