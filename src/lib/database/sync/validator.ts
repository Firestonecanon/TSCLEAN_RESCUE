import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';
import type { ValidationResult } from './types';

export class InventoryValidator {
  async validate(): Promise<ValidationResult> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select('id, category')
      .order('category');

    if (error) {
      throw new Error(`Erreur de validation: ${error.message}`);
    }

    const dbProducts = new Set(data?.map(p => p.id) || []);
    const missingProducts = products
      .filter(p => !dbProducts.has(p.id))
      .map(p => p.id);

    const categories = Array.from(new Set(data?.map(p => p.category) || []));

    return {
      totalProducts: data?.length || 0,
      categories,
      missingProducts
    };
  }
}