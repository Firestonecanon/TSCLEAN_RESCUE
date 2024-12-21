import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import { SyncLock } from './lock';
import { SyncLogger } from './logger';

export class ProductSync {
  private logger: SyncLogger;

  constructor() {
    this.logger = new SyncLogger();
  }

  private async clearInventory(): Promise<void> {
    const { error } = await supabase
      .from(TABLES.INVENTORY)
      .delete()
      .neq('id', '');
    
    if (error) throw error;
  }

  private async insertProducts(): Promise<void> {
    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      variant: p.variant || null,
      size: p.size || null,
      quantity: 10,
      in_stock: true,
      last_updated: new Date().toISOString()
    }));

    // Insérer les produits par lots de 10 pour éviter les problèmes de taille de requête
    for (let i = 0; i < formattedProducts.length; i += 10) {
      const batch = formattedProducts.slice(i, i + 10);
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .upsert(batch, {
          onConflict: 'id',
          ignoreDuplicates: true
        });

      if (error) throw error;
      
      // Attendre un court instant entre chaque lot
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async forceSync(): Promise<void> {
    this.logger.start();

    if (await SyncLock.isLocked()) {
      throw new Error('Une synchronisation est déjà en cours');
    }

    try {
      await SyncLock.acquire();

      // 1. Vérifier l'état actuel
      const { data: existingData } = await supabase
        .from(TABLES.INVENTORY)
        .select('id')
        .limit(1);

      // 2. Si des données existent, les supprimer
      if (existingData && existingData.length > 0) {
        await this.clearInventory();
        // Attendre que la suppression soit effective
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 3. Insérer les nouvelles données
      await this.insertProducts();

      // 4. Vérifier la synchronisation
      const { data: finalData, error: checkError } = await supabase
        .from(TABLES.INVENTORY)
        .select('id');

      if (checkError) throw checkError;

      this.logger.success({
        totalProducts: finalData.length,
        expectedProducts: products.length
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await SyncLock.release();
      this.logger.end();
    }
  }
}

export const productSync = new ProductSync();