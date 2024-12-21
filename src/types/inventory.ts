import { Product } from './index';

export interface InventoryItem extends Product {
  inStock: boolean;
  quantity: number;
  lastUpdated: string;
}

export interface StockUpdate {
  productId: string;
  quantity: number;
  type: 'increment' | 'decrement' | 'set';
}