import { Link } from 'react-router-dom';
import styles from './MiniCart.module.css';
import { useCart, createVariantKey } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/currency';

type MiniCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MiniCart = ({ isOpen, onClose }: MiniCartProps) => {
  const { items, summary, updateQuantity, removeItem } = useCart();

  return (
    <aside className={`${styles['mini-cart']} ${isOpen ? styles['mini-cart--open'] : ''}`} aria-hidden={!isOpen}>
      <div className={styles['mini-cart__header']}>
        <h2 className={styles['mini-cart__title']}>Your Bag</h2>
        <button type="button" className={styles['mini-cart__close']} onClick={onClose} aria-label="Close mini cart">
          ✕
        </button>
      </div>
      <div className={styles['mini-cart__content']}>
        {items.length === 0 ? (
          <p className={styles['mini-cart__empty']}>Your cart is currently empty.</p>
        ) : (
          <ul className={styles['mini-cart__list']}>
            {items.map((item) => (
              <li key={`${item.productId}-${createVariantKey(item.variant)}`} className={styles['mini-cart__item']}>
                <img src={item.image} alt={item.name} className={styles['mini-cart__image']} loading="lazy" />
                <div className={styles['mini-cart__details']}>
                  <p className={styles['mini-cart__name']}>{item.name}</p>
                  <p className={styles['mini-cart__variant']}>
                    {item.variant.size ? `Size: ${item.variant.size}` : null}
                    {item.variant.color ? ` · Color: ${item.variant.color}` : null}
                  </p>
                  <div className={styles['mini-cart__controls']}>
                    <div className={styles['mini-cart__quantity']}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, createVariantKey(item.variant), item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, createVariantKey(item.variant), item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles['mini-cart__remove']}
                      onClick={() => removeItem(item.productId, createVariantKey(item.variant))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className={styles['mini-cart__price']}>{formatCurrency(item.salePrice ?? item.price)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles['mini-cart__footer']}>
        <div className={styles['mini-cart__summary']}>
          <span>Subtotal</span>
          <strong>{formatCurrency(summary.subtotal)}</strong>
        </div>
        <Link
          to="/cart"
          className={`${styles['mini-cart__checkout']} ${items.length === 0 ? styles['mini-cart__checkout--disabled'] : ''}`}
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
