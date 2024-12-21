import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import { formatInventoryForDatabase } from '../utils';
import type { SyncResult } from './types';

export class InventoryInserter {
  private formatProducts() {
    return products.map(p => formatInventoryForDatabase({
      ...p,
      quantity: 10,
      inStock: true,
      lastUpdated: new Date().toISOString()
    }));
  }

  async insertProducts(): Promise<SyncResult> {
    try {
      const formattedProducts = this.formatProducts();
      
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .insert(formattedProducts);

      if (error) {
        return {
          success: false,
          error: new Error(error.message),
          details: error
        };
      }

      return {
        success: true,
        details: { insertedCount: formattedProducts.length }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        details: error
      };
    }
  }

  async updateProducts(): Promise<SyncResult> {
    try {
      const formattedProducts = this.formatProducts();
      
      // Utiliser upsert avec ignoreDuplicates: true pour éviter les erreurs de clé dupliquée
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .upsert(formattedProducts, {
          onConflict: 'id',
          ignoreDuplicates: true
        });

      if (error) {
        return {
          success: false,
          error: new Error(error.message),
          details: error
        };
      }

      return {
        success: true,
        details: { updatedCount: formattedProducts.length }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        details: error
      };
    }
  }
}