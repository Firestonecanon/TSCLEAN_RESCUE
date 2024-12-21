import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import type { InventoryRepository, SyncResult } from './types';
import type { InventoryItem } from '../../../types/inventory';

class SupabaseInventoryRepository implements InventoryRepository {
  async getAll(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select('*')
      .order('category');

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      variant: item.variant || undefined,
      size: item.size || undefined,
      quantity: item.quantity,
      inStock: item.in_stock,
      lastUpdated: item.last_updated
    }));
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from(TABLES.INVENTORY)
      .update({
        quantity,
        in_stock: quantity > 0,
        last_updated: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) throw error;
  }

  async sync(): Promise<void> {
    try {
      // 1. Nettoyer l'inventaire existant
      await supabase.rpc('clear_inventory');
      
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
        await supabase
          .from(TABLES.INVENTORY)
          .upsert(batch, {
            onConflict: 'id',
            ignoreDuplicates: true
          });
        
        // Pause entre chaque lot
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('[Inventory] Sync error:', error);
      throw error;
    }
  }
}

export const inventoryRepository = new SupabaseInventoryRepository();