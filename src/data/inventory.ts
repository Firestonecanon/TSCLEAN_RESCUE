import { products } from './products';
import { InventoryItem } from '../types/inventory';

// Load inventory from localStorage or initialize with default values
const loadInventory = (): InventoryItem[] => {
  const savedInventory = localStorage.getItem('inventory');
  if (savedInventory) {
    return JSON.parse(savedInventory);
  }
  
  // Initial inventory data
  return products.map(product => ({
    ...product,
    inStock: true,
    quantity: 10,
    lastUpdated: new Date().toISOString()
  }));
};

export const inventory = loadInventory();

export const updateInventory = (items: InventoryItem[]) => {
  localStorage.setItem('inventory', JSON.stringify(items));
};