import { useMemo } from 'react';
import styles from './HomePage.module.css';
import { Button } from '../../components/ui/Button/Button';
import { ProductGrid } from '../../components/product/ProductGrid/ProductGrid';
import { useProducts } from '../../context/ProductContext';
import { Loader } from '../../components/ui/Loader/Loader';

const HomePage = () => {
  const { filteredProducts, isLoading } = useProducts();

  const featured = useMemo(
    () => filteredProducts.slice(0, 4),
    [filteredProducts]
  );

  const signatureCollections = [
    {
      title: 'The Artisan Collection',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJOj1zrjQXqNN_ndJwkJHHsq03GSFxuL4-xzFtmexDIySsTviZLrcyTWjJhQQbWcYg7nj5d7Nqjo1FhQUEjByd6deNVJ1511fvOjP_GNZKO-GNekdiX8rJQpQDhkNkXlstTk_P9lEH6kkov4wr7-83mXtMLZ0EKKUMinF7jP6OfMJ4cttm4TAfghGhvchBG0RO5BcoskAUciIRLGRnqEV2znwQD5-qV5IVMhmDd4BV9vnRtd9Rk9wKx90STvw2VyDxxjh2zkh_YY',
      linkLabel: 'Shop Now'
    },
    {
      title: 'The Minimalist Collection',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDbq34HfjFaAsUF6YRjLz95Vgb0CnBlWBeA-ZXnBjmkTLroiK2tstDQ6bhBycxZIpa61SD20UTPV0Rlw7W_-8qB2fqqgJ0hDfuNsGpYMHURm9e7mWn0PNRj9AKcZ7TXR94xaNySt9HelIssm_nusX79mcg5EoqW_WS_sFZfrIxWtdKCSh0z01Bwy3z-Bf9ItJNPmI-XPjTfmgkZQygwaTYZHW2cwBlBpOIDmDuPrSOT_Y3JLxm182tlz0FyeilTdo2Lhzai2gFYtiw',
      linkLabel: 'Shop Now'
    },
    {
      title: 'The Bohemian Collection',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGnUYM8T2w4UH-BUQ4PyNEY-5fj8rr8uXr_EW5L9-aTDVDob0zJn5uzUTM_AtuqSjKkJ6CEC1a_jDSvnFt8TYJVD8h9JwMYAk7KaKvDk-xDPpyFVAbQ2lQL1WrLoDvl8BYW0rXQGt4B3mgQ9ZaSDUJVEk7_dA-IbL8CeS5Czu8-LiU4Hs67ApvlDyHdL7IEuIHvNWTBP0M7eNrSqV5DuAWpXCYT7X2zd3s_JaF4uyWUKeiSkmP5oy-D4gefrc9yUhdeKwMDTdfp8',
      linkLabel: 'Shop Now'
    }
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles['hero__panel']}>
          <h1 className={styles['hero__title']}>The Art of Adornment</h1>
          <Button variant="primary" size="lg">
            Shop Now
          </Button>
        </div>
      </section>

      <section className={styles.collections}>
        <h2 className={styles['collections__title']}>Our Signature Collections</h2>
        <div className={styles['collections__grid']}>
          {signatureCollections.map((collection) => (
            <article key={collection.title} className={styles['collections__item']}>
              <div className={styles['collections__image']}>
                <img src={collection.image} alt={collection.title} loading="lazy" />
              </div>
              <p className={styles['collections__name']}>{collection.title}</p>
              <a href="/products" className={styles['collections__link']}>
                {collection.linkLabel}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.arrivals}>
        <h2 className={styles['arrivals__title']}>Freshly Crafted</h2>
        {isLoading ? (
          <Loader variant="section" />
        ) : (
          <ProductGrid
            products={featured}
            emptyState={<p className={styles['arrivals__empty']}>New styles are on the way.</p>}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;
