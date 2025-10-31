import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { UIProvider } from '../context/UIContext';
import { ProductProvider } from '../context/ProductContext';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <UIProvider>
      <ProductProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </ProductProvider>
    </UIProvider>
  </AuthProvider>
);
