import { CartItem } from "../../types/cart";

export const formatVariantLabel = (variant: CartItem["variant"]) => {
  const parts: string[] = [];

  if (variant.size) {
    parts.push(`Size: ${variant.size}`);
  }

  if (variant.color) {
    parts.push(`Color: ${variant.color}`);
  }

  return parts.join(" · ");
};

