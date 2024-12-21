import { supabase } from './client';
import { TABLES } from './schema';
import type { InventoryItem } from '../../types/inventory';
import { formatDatabaseItem, formatInventoryForDatabase } from './utils';
import { productSync } from './sync/productSync';

class InventoryDatabase {
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('[DB] Initialisation...');
      
      // Vérifier si la table est vide
      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .select('id')
        .limit(1);

      if (error) throw error;

      // Si la table est vide, faire une synchronisation initiale
      if (!data || data.length === 0) {
        await productSync.forceSync();
      }

      this.initialized = true;
      console.log('[DB] Initialisation terminée');
    } catch (error) {
      console.error('[DB] Erreur d\'initialisation:', error);
      throw error;
    }
  }

  async getAll(): Promise<InventoryItem[]> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;

      return data.map(formatDatabaseItem);
    } catch (error) {
      console.error('[DB] Erreur de chargement:', error);
      throw error;
    }
  }

  async updateItem(item: InventoryItem): Promise<void> {
    try {
      const formattedItem = formatInventoryForDatabase(item);
      
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .update(formattedItem)
        .eq('id', item.id);

      if (error) throw error;
    } catch (error) {
      console.error('[DB] Erreur de mise à jour:', error);
      throw error;
    }
  }
}

export const inventoryDB = new InventoryDatabase();