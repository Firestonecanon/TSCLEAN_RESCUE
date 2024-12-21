import type { InventoryItem } from '../../types/inventory';

export interface DatabaseClient {
  initialize(): Promise<void>;
  getAll(): Promise<InventoryItem[]>;
  updateItem(item: InventoryItem): Promise<void>;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: unknown;
}