import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { TABLES } from '../schema';

export type RealtimeEvent = {
  type: 'UPDATE' | 'INSERT' | 'DELETE';
  table: string;
  payload: RealtimePostgresChangesPayload<any>;
};

export type RealtimeEventHandler = (event: RealtimeEvent) => void;

export const createInventoryEventHandler = (onUpdate: () => void): RealtimeEventHandler => {
  return (event: RealtimeEvent) => {
    if (event.table === TABLES.INVENTORY) {
      console.log('[Realtime] Changement détecté:', event.type);
      onUpdate();
    }
  };
};