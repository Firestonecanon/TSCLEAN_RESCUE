import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../client';
import { TABLES } from '../schema';
import { RealtimeEventHandler } from './events';

export class RealtimeChannel {
  private channel: RealtimeChannel | null = null;
  private readonly channelName: string;
  private readonly eventHandler: RealtimeEventHandler;

  constructor(channelName: string, eventHandler: RealtimeEventHandler) {
    this.channelName = channelName;
    this.eventHandler = eventHandler;
  }

  connect(): void {
    if (this.channel) {
      return;
    }

    console.log(`[${this.channelName}] Connexion...`);

    this.channel = supabase
      .channel(this.channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.INVENTORY
        },
        (payload) => {
          this.eventHandler({
            type: payload.eventType.toUpperCase() as any,
            table: TABLES.INVENTORY,
            payload
          });
        }
      )
      .subscribe((status) => {
        console.log(`[${this.channelName}] Status:`, status);
      });
  }

  disconnect(): void {
    if (this.channel) {
      console.log(`[${this.channelName}] Déconnexion`);
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}