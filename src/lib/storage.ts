import { InventoryItem } from '../types/inventory';
import { products } from '../data/products';

const STORAGE_KEY = 'ts-clean-inventory';

export const storage = {
  getInventory: (): InventoryItem[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du stockage:', error);
    }
    
    // Initialisation par défaut
    const initial = products.map(product => ({
      ...product,
      inStock: true,
      quantity: 10,
      lastUpdated: new Date().toISOString()
    }));
    
    storage.saveInventory(initial);
    return initial;
  },

  saveInventory: (inventory: InventoryItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du stockage:', error);
    }
  }
};