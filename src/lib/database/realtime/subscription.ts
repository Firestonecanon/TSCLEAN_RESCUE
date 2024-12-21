import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../client';
import { TABLES } from '../schema';

export class RealtimeSubscription {
  private channel: RealtimeChannel | null = null;
  private static instance: RealtimeSubscription;

  private constructor() {}

  static getInstance(): RealtimeSubscription {
    if (!RealtimeSubscription.instance) {
      RealtimeSubscription.instance = new RealtimeSubscription();
    }
    return RealtimeSubscription.instance;
  }

  subscribe(onUpdate: () => void): void {
    if (this.channel) {
      return;
    }

    console.log('[Realtime] Initialisation de la souscription...');

    this.channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.INVENTORY
        },
        (payload) => {
          console.log('[Realtime] Changement détecté:', payload.eventType);
          onUpdate();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Status:', status);
      });
  }

  unsubscribe(): void {
    if (this.channel) {
      console.log('[Realtime] Désinscription');
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const realtimeSubscription = RealtimeSubscription.getInstance();