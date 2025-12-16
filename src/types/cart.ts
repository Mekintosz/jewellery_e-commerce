import { ProductVariantOption } from "./product";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  image: string;
  variant: ProductVariantOption;
  maxQuantity: number;
};

export type CartSummary = {
  subtotal: number;
  discounts: number;
  tax: number;
  total: number;
};

export type Coupon = {
  code: string;
  description: string;
  discountPercentage: number;
  expiresAt?: string;
};
