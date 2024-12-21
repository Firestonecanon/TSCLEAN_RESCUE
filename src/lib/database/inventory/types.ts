import type { InventoryItem } from '../../../types/inventory';

export interface InventoryRepository {
  getAll(): Promise<InventoryItem[]>;
  updateStock(productId: string, quantity: number): Promise<void>;
  sync(): Promise<void>;
}

export interface SyncResult {
  success: boolean;
  error?: Error;
  details?: {
    totalProducts: number;
    expectedProducts: number;
  };
}