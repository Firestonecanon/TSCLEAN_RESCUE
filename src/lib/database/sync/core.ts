import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import type { SyncResult } from './types';

export class SyncCore {
  private async clearInventory(): Promise<void> {
    const { error } = await supabase.rpc('clear_inventory');
    if (error) throw error;
  }

  private async insertBatch(products: any[]): Promise<void> {
    const { error } = await supabase
      .from(TABLES.INVENTORY)
      .upsert(products, {
        onConflict: 'id',
        ignoreDuplicates: true
      });

    if (error) throw error;
  }

  async sync(): Promise<SyncResult> {
    try {
      // 1. Nettoyer l'inventaire existant
      await this.clearInventory();
      
      // 2. Attendre que le nettoyage soit effectif
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Préparer les données
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

      // 4. Insérer par lots de 5 produits
      const batchSize = 5;
      for (let i = 0; i < formattedProducts.length; i += batchSize) {
        const batch = formattedProducts.slice(i, i + batchSize);
        await this.insertBatch(batch);
        // Pause entre chaque lot
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 5. Vérification finale
      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .select('id')
        .order('id');

      if (error) throw error;

      return {
        success: true,
        details: {
          totalProducts: data.length,
          expectedProducts: products.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}