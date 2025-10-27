export type ProductVariantOption = {
  size?: string;
  color?: string;
};

export type ProductVariants = {
  size: string[];
  color: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity: number;
  variants: ProductVariants;
  tags?: string[];
  createdAt?: string;
};

export type ProductFilters = {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | null;
  inStockOnly: boolean;
  query: string;
  tags: string[];
};
