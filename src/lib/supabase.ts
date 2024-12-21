import { createClient } from '@supabase/supabase-js';
import type { InventoryItem } from '../types/inventory';
import { products } from '../data/products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const inventoryDB = {
  async initialize(): Promise<void> {
    try {
      // Créer la table si elle n'existe pas
      const { error: createError } = await supabase.rpc('create_inventory_table');
      if (createError) throw createError;

      // Vérifier si la table contient des données
      const { data: existingData, error: checkError } = await supabase
        .from('inventory')
        .select('id')
        .limit(1);

      if (checkError || !existingData || existingData.length === 0) {
        // Initialiser avec les données par défaut
        const initialInventory = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          variant: product.variant || null,
          size: product.size || null,
          quantity: 10,
          in_stock: true,
          last_updated: new Date().toISOString()
        }));

        // Supprimer toutes les données existantes
        await supabase.from('inventory').delete().neq('id', '');

        // Insérer les nouvelles données
        const { error: insertError } = await supabase
          .from('inventory')
          .insert(initialInventory);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Erreur d\'initialisation de l\'inventaire:', error);
      throw error;
    }
  },

  async getAll(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('id');

      if (error) throw error;
      
      // Convertir les noms de colonnes snake_case en camelCase
      const formattedData = data?.map(item => ({
        ...item,
        inStock: item.in_stock,
        lastUpdated: item.last_updated,
      }));

      if (!formattedData || formattedData.length === 0) {
        await this.initialize();
        const { data: newData, error: newError } = await supabase
          .from('inventory')
          .select('*')
          .order('id');
        
        if (newError) throw newError;
        return newData.map(item => ({
          ...item,
          inStock: item.in_stock,
          lastUpdated: item.last_updated,
        }));
      }

      return formattedData;
    } catch (error) {
      console.error('Erreur de chargement:', error);
      throw error;
    }
  },

  async updateItem(item: InventoryItem): Promise<void> {
    try {
      const { error } = await supabase
        .from('inventory')
        .upsert({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          variant: item.variant || null,
          size: item.size || null,
          quantity: item.quantity,
          in_stock: item.quantity > 0,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      throw error;
    }
  }
};