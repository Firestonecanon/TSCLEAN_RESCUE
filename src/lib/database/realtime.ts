import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './client';
import { TABLES } from './schema';

class RealtimeManager {
  private channel: RealtimeChannel | null = null;
  private static instance: RealtimeManager;

  private constructor() {}

  static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  subscribe(onUpdate: () => void): void {
    if (this.channel) {
      return;
    }

    console.log('[Realtime] Initialisation...');

    this.channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.INVENTORY
        },
        () => {
          console.log('[Realtime] Changement détecté');
          onUpdate();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Status:', status);
      });
  }

  unsubscribe(): void {
    if (this.channel) {
      console.log('[Realtime] Déconnexion');
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const realtimeManager = RealtimeManager.getInstance();