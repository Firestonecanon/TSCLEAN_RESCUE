import { supabase } from '../client';
import type { SyncResult } from './types';

export class InventoryCleaner {
  async cleanInventory(): Promise<SyncResult> {
    try {
      // Utiliser la fonction RPC pour le nettoyage atomique
      const { error } = await supabase.rpc('clear_inventory');
      
      if (error) {
        return {
          success: false,
          error: new Error(error.message),
          details: error
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        details: error
      };
    }
  }
}