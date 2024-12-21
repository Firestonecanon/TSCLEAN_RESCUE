import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/database/client';
import { inventoryRepository } from '../lib/inventory/repository';
import type { InventoryItem } from '../types/inventory';
import type { Product } from '../types';

interface InventoryContextType {
  inventory: InventoryItem[];
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  updateStock: (productId: string, quantity: number) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loadInventory: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = async () => {
    try {
      setError(null);
      const data = await inventoryRepository.getAll();
      setInventory(data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'inventaire');
      console.error('[InventoryContext] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();

    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        () => {
          loadInventory();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setError(null);
      await inventoryRepository.createProduct(product);
      await loadInventory();
    } catch (err) {
      setError('Erreur lors de la création du produit');
      throw err;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setError(null);
      await inventoryRepository.updateProduct(product);
      await loadInventory();
    } catch (err) {
      setError('Erreur lors de la modification du produit');
      throw err;
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    try {
      setError(null);
      await inventoryRepository.updateStock(productId, quantity);
      await loadInventory();
    } catch (err) {
      setError('Erreur lors de la mise à jour du stock');
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setError(null);
      await inventoryRepository.deleteProduct(productId);
      await loadInventory();
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
      throw err;
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      inventory, 
      createProduct,
      updateProduct,
      updateStock,
      deleteProduct,
      loadInventory,
      isLoading, 
      error 
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}