import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type WishlistContextValue = {
  items: string[];
  toggleItem: (productId: string) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
};

const WISHLIST_STORAGE_KEY = "jewellery-wishlist";

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { value, setValue } = useLocalStorage<string[]>(
    WISHLIST_STORAGE_KEY,
    [],
  );

  // Optimize lookups by creating a Set for O(1) complexity instead of O(n)
  const itemsSet = useMemo(() => new Set(value), [value]);

  const addItem = useCallback(
    (productId: string) => {
      if (itemsSet.has(productId)) {
        return;
      }
      setValue([...value, productId]);
    },
    [setValue, value, itemsSet],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setValue(value.filter((id) => id !== productId));
    },
    [setValue, value],
  );

  const toggleItem = useCallback(
    (productId: string) => {
      if (itemsSet.has(productId)) {
        removeItem(productId);
      } else {
        addItem(productId);
      }
    },
    [addItem, removeItem, itemsSet],
  );

  const isInWishlist = useCallback(
    (productId: string) => itemsSet.has(productId),
    [itemsSet],
  );

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  const contextValue = useMemo(
    () => ({
      items: value,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clear,
    }),
    [addItem, clear, isInWishlist, removeItem, toggleItem, value],
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
