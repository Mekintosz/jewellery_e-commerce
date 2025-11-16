import styles from './Rating.module.css';

type RatingProps = {
  value: number;
  reviews?: number;
  ariaLabel?: string;
};

const STAR_COUNT = 5;

export const Rating = ({ value, reviews, ariaLabel }: RatingProps) => {
  const stars = Array.from({ length: STAR_COUNT }, (_, index) => {
    const starValue = index + 1;
    const filled = starValue <= Math.round(value);
    return (
      <span key={starValue} className={filled ? styles['rating__star--filled'] : styles['rating__star']}>
        ★
      </span>
    );
  });

  return (
    <div className={styles.rating} aria-label={ariaLabel ?? `Rated ${value} out of 5`}>
      {stars}
      {typeof reviews === 'number' ? <span className={styles['rating__reviews']}>({reviews})</span> : null}
    </div>
  );
};
