import { supabase } from '../database/client';
import type { InventoryItem } from '../../types/inventory';
import type { Product } from '../../types';
import { customAlphabet } from 'nanoid';

const generateId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16
);

class InventoryRepository {
  private readonly TABLE = 'inventory';

  async getAll(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE)
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;

      return data.map(item => ({
        ...item,
        inStock: item.in_stock,
        lastUpdated: item.last_updated,
        variant: item.variant || undefined,
        size: item.size || undefined
      }));
    } catch (error) {
      console.error('[InventoryRepository] Load error:', error);
      throw error;
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .insert({
          id: `prod_${generateId()}`,
          ...product,
          quantity: 0,
          in_stock: false,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('[InventoryRepository] Create error:', error);
      throw error;
    }
  }

  async updateProduct(product: Product): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          variant: product.variant || null,
          size: product.size || null,
          last_updated: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;
    } catch (error) {
      console.error('[InventoryRepository] Update error:', error);
      throw error;
    }
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .update({
          quantity,
          in_stock: quantity > 0,
          last_updated: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('[InventoryRepository] Update error:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE)
        .delete()
        .eq('id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('[InventoryRepository] Delete error:', error);
      throw error;
    }
  }
}

export const inventoryRepository = new InventoryRepository();