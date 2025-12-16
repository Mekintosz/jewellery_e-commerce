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

  const addItem = useCallback(
    (productId: string) => {
      if (value.includes(productId)) {
        return;
      }
      setValue([...value, productId]);
    },
    [setValue, value],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setValue(value.filter((id) => id !== productId));
    },
    [setValue, value],
  );

  const toggleItem = useCallback(
    (productId: string) => {
      if (value.includes(productId)) {
        removeItem(productId);
      } else {
        addItem(productId);
      }
    },
    [addItem, removeItem, value],
  );

  const isInWishlist = useCallback(
    (productId: string) => value.includes(productId),
    [value],
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
