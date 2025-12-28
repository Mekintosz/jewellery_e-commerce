import { useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { ProductGrid } from "../../components/product/ProductGrid/ProductGrid";
import { useProducts } from "../../context/ProductContext";
import { Loader } from "../../components/ui/Loader/Loader";

const signatureCollections = [
  {
    title: "The Artisan Collection",
    image: "/images/collection-artisan.png",
    linkLabel: "Shop Now",
  },
  {
    title: "The Minimalist Collection",
    image: "/images/collection-minimalist.png",
    linkLabel: "Shop Now",
  },
  {
    title: "The Bohemian Collection",
    image: "/images/collection-bohemian.png",
    linkLabel: "Shop Now",
  },
];

const HomePage = () => {
  const { filteredProducts, isLoading } = useProducts();

  const featured = useMemo(
    () => filteredProducts.slice(0, 3),
    [filteredProducts],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles["hero__image"]}>
          <img src="/images/hero-pendant.png" alt="Luxury jewelry" />
        </div>
        <div className={styles["hero__panel"]}>
          <h1 className={styles["hero__title"]}>The Art of Adornment</h1>
          <Link to="/products" className={styles["hero__button"]}>
            Shop Now
          </Link>
        </div>
      </section>

      <section className={styles.collections}>
        <h2 className={styles["collections__title"]}>
          Our Signature Collections
        </h2>
        <div className={styles["collections__grid"]}>
          {signatureCollections.map((collection) => (
            <article
              key={collection.title}
              className={styles["collections__item"]}
            >
              <div className={styles["collections__image"]}>
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                />
              </div>
              <p className={styles["collections__name"]}>{collection.title}</p>
              <Link to="/products" className={styles["collections__link"]}>
                {collection.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.arrivals}>
        <h2 className={styles["arrivals__title"]}>Freshly Crafted</h2>
        {isLoading ? (
          <Loader variant="section" />
        ) : (
          <ProductGrid
            products={featured}
            emptyState={
              <p className={styles["arrivals__empty"]}>
                New styles are on the way.
              </p>
            }
            sortVisible={false}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;
