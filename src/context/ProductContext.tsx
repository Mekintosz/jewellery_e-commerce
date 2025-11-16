import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Product, ProductFilters } from '../types/product';
import { productService } from '../services/productService';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

type ProductContextValue = {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  sortBy: SortOption;
  setFilters: (filters: ProductFilters) => void;
  setSort: (sort: SortOption) => void;
  refresh: () => Promise<void>;
};

const defaultFilters: ProductFilters = {
  categories: [],
  brands: [],
  priceRange: [0, 10000],
  rating: null,
  inStockOnly: false,
  query: '',
  tags: []
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

const sortProducts = (products: Product[], sort: SortOption) => {
  switch (sort) {
    case 'price-asc':
      return [...products].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'price-desc':
      return [...products].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'newest':
      return [...products].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
};

const filterProducts = (products: Product[], filters: ProductFilters) => {
  const { categories, brands, priceRange, rating, inStockOnly, query, tags } = filters;

  return products.filter((product) => {
    const matchesCategory = categories.length === 0 || categories.includes(product.category);
    const matchesBrand = brands.length === 0 || brands.includes(product.brand);
    const price = product.salePrice ?? product.price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesRating = rating == null || product.rating >= rating;
    const matchesStock = !inStockOnly || product.inStock;
    const matchesQuery =
      query.trim().length === 0 ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    const matchesTags = tags.length === 0 || tags.every((tag) => product.tags?.includes(tag));

    return matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock && matchesQuery && matchesTags;
  });
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const applyFilters = useCallback(
    (allProducts: Product[], currentFilters: ProductFilters, sort: SortOption) => {
      const filteredProducts = filterProducts(allProducts, currentFilters);
      return sortProducts(filteredProducts, sort);
    },
    []
  );

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setFiltered(applyFilters(data, filters, sortBy));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load products');
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters, filters, sortBy]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setFiltered(applyFilters(products, filters, sortBy));
  }, [applyFilters, filters, products, sortBy]);

  const handleSetFilters = useCallback(
    (nextFilters: ProductFilters) => {
      setFiltersState(nextFilters);
    },
    []
  );

  const handleSetSort = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const contextValue = useMemo<ProductContextValue>(
    () => ({
      products,
      filteredProducts: filtered,
      isLoading,
      error,
      filters,
      sortBy,
      setFilters: handleSetFilters,
      setSort: handleSetSort,
      refresh: loadProducts
    }),
    [error, filtered, filters, handleSetFilters, handleSetSort, isLoading, loadProducts, products, sortBy]
  );

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
