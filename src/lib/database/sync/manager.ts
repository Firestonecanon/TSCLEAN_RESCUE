import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import { formatInventoryForDatabase } from '../utils';
import type { SyncResult } from './types';

export class SyncManager {
  private lockKey = 'sync_lock';
  private lockTimeout = 30000; // 30 secondes

  async isLocked(): Promise<boolean> {
    const { data } = await supabase
      .from('sync_locks')
      .select('expires_at')
      .eq('key', this.lockKey)
      .single();

    if (!data) return false;

    const expiresAt = new Date(data.expires_at).getTime();
    return Date.now() < expiresAt;
  }

  async lock(): Promise<void> {
    const timestamp = Date.now();
    await supabase
      .from('sync_locks')
      .upsert({
        key: this.lockKey,
        acquired_at: new Date(timestamp).toISOString(),
        expires_at: new Date(timestamp + this.lockTimeout).toISOString()
      });
  }

  async unlock(): Promise<void> {
    await supabase
      .from('sync_locks')
      .delete()
      .eq('key', this.lockKey);
  }

  async execute(): Promise<SyncResult> {
    try {
      // 1. Préparer les produits
      const formattedProducts = products.map(p => formatInventoryForDatabase({
        ...p,
        quantity: 10,
        inStock: true,
        lastUpdated: new Date().toISOString()
      }));

      // 2. Utiliser upsert pour la mise à jour/insertion
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .upsert(formattedProducts, {
          onConflict: 'id',
          ignoreDuplicates: true // Ignorer les doublons au lieu d'échouer
        });

      if (error) throw error;

      // 3. Vérifier la synchronisation
      const validation = await this.validate();

      return {
        success: true,
        details: validation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  private async validate() {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select('id, category')
      .order('category');

    if (error) throw error;

    const categories = new Set(data.map(item => item.category));
    const expectedCategories = new Set(products.map(p => p.category));

    return {
      totalProducts: data.length,
      categories: categories.size,
      expectedCategories: expectedCategories.size,
      missingCategories: Array.from(expectedCategories).filter(cat => !categories.has(cat))
    };
  }
}