import { supabase } from './client';
import { TABLES } from './schema';
import { products } from '../../data/products';

class ProductSynchronizer {
  private async upsertProducts() {
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

    const { error } = await supabase
      .from(TABLES.INVENTORY)
      .upsert(formattedProducts, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  }

  async syncProducts(): Promise<void> {
    try {
      console.log('[Sync] Début de la synchronisation...');
      await this.upsertProducts();
      console.log('[Sync] Synchronisation terminée avec succès');
    } catch (error) {
      console.error('[Sync] Erreur de synchronisation:', error);
      throw error;
    }
  }
}

export const productSynchronizer = new ProductSynchronizer();