import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { CartItem, CartSummary, Coupon } from "../types/cart";
import { Product } from "../types/product";
import { useLocalStorage } from "../hooks/useLocalStorage";

type CartState = {
  items: CartItem[];
  coupon: Coupon | null;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantKey: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; variantKey: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: Coupon | null }
  | { type: "HYDRATE"; payload: CartState };

type CartContextValue = {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (
    product: Product,
    item: Omit<
      CartItem,
      "productId" | "name" | "price" | "image" | "maxQuantity"
    >,
  ) => void;
  removeItem: (productId: string, variantKey: string) => void;
  updateQuantity: (
    productId: string,
    variantKey: string,
    quantity: number,
  ) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;
  summary: CartSummary;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const createVariantKey = (variant: CartItem["variant"]) =>
  `${variant.color ?? "default"}-${variant.size ?? "default"}`;

const reduceCart = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const incoming = action.payload;
      const key = createVariantKey(incoming.variant);
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === incoming.productId &&
          createVariantKey(item.variant) === key,
      );

      if (existingIndex >= 0) {
        const nextItems = [...state.items];
        const existing = nextItems[existingIndex];
        const newQuantity = Math.min(
          existing.maxQuantity,
          existing.quantity + incoming.quantity,
        );
        nextItems[existingIndex] = { ...existing, quantity: newQuantity };
        return { ...state, items: nextItems };
      }

      return { ...state, items: [...state.items, incoming] };
    }
    case "REMOVE_ITEM": {
      const { productId, variantKey: key } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.productId === productId &&
              createVariantKey(item.variant) === key
            ),
        ),
      };
    }
    case "UPDATE_QUANTITY": {
      const { productId, variantKey: key, quantity } = action.payload;
      const nextItems = state.items.map((item) => {
        if (
          item.productId === productId &&
          createVariantKey(item.variant) === key
        ) {
          return {
            ...item,
            quantity: Math.max(1, Math.min(item.maxQuantity, quantity)),
          };
        }
        return item;
      });
      return { ...state, items: nextItems };
    }
    case "CLEAR_CART":
      return { items: [], coupon: null };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
};

const calculateSummary = (
  items: CartItem[],
  coupon: Coupon | null,
): CartSummary => {
  const subtotal = items.reduce((acc, item) => {
    const price = item.salePrice ?? item.price;
    return acc + price * item.quantity;
  }, 0);

  const discount = coupon ? subtotal * (coupon.discountPercentage / 100) : 0;
  const tax = (subtotal - discount) * 0.07;
  const total = subtotal - discount + tax;

  return {
    subtotal,
    discounts: discount,
    tax,
    total,
  };
};

const CART_STORAGE_KEY = "jewellery-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { value: storedCart, setValue } = useLocalStorage<CartState>(
    CART_STORAGE_KEY,
    {
      items: [],
      coupon: null,
    },
  );

  const [state, dispatch] = useReducer(reduceCart, storedCart);
  const lastPersistedRef = useRef(state);

  // Persist cart state to localStorage after every state change
  useEffect(() => {
    lastPersistedRef.current = state;
    setValue(state);
  }, [state, setValue]);

  // Sync cart state when localStorage changes (e.g., from another tab)
  useEffect(() => {
    // Only hydrate if storedCart is different from what we last persisted
    // This prevents loops while enabling cross-tab sync
    if (storedCart !== lastPersistedRef.current) {
      dispatch({ type: "HYDRATE", payload: storedCart });
    }
  }, [storedCart]);

  const addItem = useCallback(
    (
      product: Product,
      item: Omit<
        CartItem,
        "productId" | "name" | "price" | "image" | "maxQuantity"
      >,
    ) => {
      const payload: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images[0],
        maxQuantity: product.stockQuantity,
        ...item,
      };
      dispatch({ type: "ADD_ITEM", payload });
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (productId: string, key: string) => {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { productId, variantKey: key },
      });
    },
    [dispatch],
  );

  const updateQuantity = useCallback(
    (productId: string, key: string, quantity: number) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, variantKey: key, quantity },
      });
    },
    [dispatch],
  );

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      dispatch({ type: "APPLY_COUPON", payload: coupon });
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  const summary = useMemo(
    () => calculateSummary(state.items, state.coupon),
    [state.coupon, state.items],
  );

  const contextValue = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      coupon: state.coupon,
      summary,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      clearCart,
    }),
    [
      addItem,
      applyCoupon,
      clearCart,
      removeItem,
      state.coupon,
      state.items,
      summary,
      updateQuantity,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
