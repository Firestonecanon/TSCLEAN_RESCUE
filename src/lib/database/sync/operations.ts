import { supabase } from '../client';
import { TABLES } from '../schema';
import { products } from '../../../data/products';

// Opérations atomiques de base
export async function clearInventory(): Promise<void> {
  const { error } = await supabase.rpc('clear_inventory');
  if (error) throw error;
}

export async function insertProducts(): Promise<void> {
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
      ignoreDuplicates: true
    });

  if (error) throw error;
}