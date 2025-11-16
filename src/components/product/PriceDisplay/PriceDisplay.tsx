import clsx from 'clsx';
import styles from './PriceDisplay.module.css';
import { formatCurrency } from '../../../utils/currency';

type PriceDisplayProps = {
  price: number;
  salePrice?: number | null;
  className?: string;
};

export const PriceDisplay = ({ price, salePrice, className }: PriceDisplayProps) => {
  const isOnSale = Boolean(salePrice) && salePrice !== price;
  return (
    <div className={clsx(styles.price, className)}>
      {isOnSale ? (
        <>
          <span className={styles['price__sale']}>{formatCurrency(salePrice ?? price)}</span>
          <span className={styles['price__original']}>{formatCurrency(price)}</span>
        </>
      ) : (
        <span className={styles['price__regular']}>{formatCurrency(price)}</span>
      )}
    </div>
  );
};
