export interface SyncResult {
  success: boolean;
  error?: Error;
  details?: {
    totalProducts: number;
    expectedProducts: number;
  };
}