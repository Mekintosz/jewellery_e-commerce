import { mockProducts } from '../data/mockProducts';
import { Product } from '../types/product';

const simulateNetworkDelay = async (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getProducts(): Promise<Product[]> {
    await simulateNetworkDelay();
    return mockProducts;
  },

  async getProductById(id: string): Promise<Product | null> {
    await simulateNetworkDelay();
    return mockProducts.find((product) => product.id === id) ?? null;
  }
};
