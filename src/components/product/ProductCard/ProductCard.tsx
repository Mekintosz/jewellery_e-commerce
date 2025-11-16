import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { Product } from '../../../types/product';
import { PriceDisplay } from '../PriceDisplay/PriceDisplay';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const defaultVariant = {
    size: product.variants.size[0],
    color: product.variants.color[0]
  };

  const handleAddToCart = () => {
    addItem(product, { quantity: 1, variant: defaultVariant });
  };

  return (
    <article className={styles.card}>
      <div className={styles['card__media']}>
        <Link to={`/products/${product.id}`} className={styles['card__image-wrapper']}>
          <img src={product.images[0]} alt={product.name} className={styles['card__image']} loading="lazy" />
        </Link>
        <button
          type="button"
          className={styles['card__cta']}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
        <button
          type="button"
          className={`${styles['card__wishlist']} ${inWishlist ? styles['card__wishlist--active'] : ''}`}
          onClick={() => toggleItem(product.id)}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          ♡
        </button>
      </div>
      <div className={styles['card__content']}>
        <Link to={`/products/${product.id}`} className={styles['card__name']}>
          {product.name}
        </Link>
        <PriceDisplay price={product.price} salePrice={product.salePrice} />
      </div>
    </article>
  );
};
