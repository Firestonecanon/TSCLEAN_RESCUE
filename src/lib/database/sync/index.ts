import { SyncCore } from './core';

class ProductSynchronizer {
  private core: SyncCore;

  constructor() {
    this.core = new SyncCore();
  }

  async syncProducts(): Promise<void> {
    console.log('[Sync] Début de la synchronisation...');

    try {
      const result = await this.core.sync();
      
      if (!result.success) {
        throw result.error;
      }

      console.log('[Sync] Synchronisation réussie');
    } catch (error) {
      console.error('[Sync] Erreur de synchronisation:', error);
      throw error;
    }
  }
}

export const productSynchronizer = new ProductSynchronizer();