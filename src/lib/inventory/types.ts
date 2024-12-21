import type { Product } from '../../types';

export interface InventoryItem extends Product {
  quantity: number;
  inStock: boolean;
  lastUpdated: string;
}

export interface InventoryManager {
  getAll(): Promise<InventoryItem[]>;
  updateStock(productId: string, quantity: number): Promise<void>;
  syncInventory(): Promise<void>;
}

export interface SyncResult {
  success: boolean;
  error?: Error;
  details?: {
    totalProducts: number;
    expectedProducts: number;
  };
}