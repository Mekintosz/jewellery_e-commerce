import { useState } from "react";
import styles from "./ImageGallery.module.css";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className={styles.gallery}>
      <div className={styles["gallery__main"]}>
        <img src={activeImage} alt={alt} loading="lazy" />
      </div>
      <div className={styles["gallery__thumbnails"]}>
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            className={`${styles["gallery__thumbnail"]} ${index === activeIndex ? styles["gallery__thumbnail--active"] : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
