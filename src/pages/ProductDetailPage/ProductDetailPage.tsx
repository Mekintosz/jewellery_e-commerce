import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailPage.module.css";
import { useProducts } from "../../context/ProductContext";
import { ImageGallery } from "../../components/product/ImageGallery/ImageGallery";
import { PriceDisplay } from "../../components/product/PriceDisplay/PriceDisplay";
import { Rating } from "../../components/ui/Rating/Rating";
import { Button } from "../../components/ui/Button/Button";
import { Select } from "../../components/forms/Select/Select";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "../../components/ui/Tabs/Tabs";
import { Loader } from "../../components/ui/Loader/Loader";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products, isLoading } = useProducts();
  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [products, productId],
  );
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.variants.size[0]);
      setSelectedColor(product.variants.color[0]);
    }
  }, [product]);

  if (isLoading) {
    return <Loader variant="page" />;
  }

  if (!product) {
    return <p className={styles["page__empty"]}>Product not found.</p>;
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    addItem(product, {
      quantity,
      variant: { size: selectedSize, color: selectedColor },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles["page__layout"]}>
        <ImageGallery images={product.images} alt={product.name} />
        <section className={styles["page__details"]}>
          <p className={styles["page__brand"]}>{product.brand}</p>
          <h1 className={styles["page__title"]}>{product.name}</h1>
          <Rating value={product.rating} reviews={product.reviews} />
          <PriceDisplay price={product.price} salePrice={product.salePrice} />
          <p className={styles["page__description"]}>{product.description}</p>

          <div className={styles["page__form"]}>
            <Select
              label="Size"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
            >
              {product.variants.size.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
            <Select
              label="Metal"
              value={selectedColor}
              onChange={(event) => setSelectedColor(event.target.value)}
            >
              {product.variants.color.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </Select>
            <label className={styles["page__quantity"]}>
              Quantity
              <input
                type="number"
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
          </div>

          <div className={styles["page__actions"]}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to bag" : "Sold out"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => toggleItem(product.id)}
            >
              {inWishlist ? "Saved" : "Save to wishlist"}
            </Button>
          </div>

          <Tabs>
            <TabList>
              <Tab index={0}>Details</Tab>
              <Tab index={1}>Care</Tab>
              <Tab index={2}>Shipping</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ul className={styles["page__list"]}>
                  <li>925 recycled gold with conflict-free diamonds</li>
                  <li>Handcrafted by master artisans in our Paris atelier</li>
                  <li>Complimentary engraving available on request</li>
                </ul>
              </TabPanel>
              <TabPanel>
                <p>
                  Clean gently with warm water and a soft cloth. Avoid harsh
                  chemicals or ultrasonic cleaners.
                </p>
              </TabPanel>
              <TabPanel>
                <p>
                  Complimentary insured shipping worldwide. Dispatch within 2
                  business days.
                </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
