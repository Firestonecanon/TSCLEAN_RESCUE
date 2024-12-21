import { supabase } from '../client';
import { TABLES } from '../schema';

export class SyncLock {
  private static readonly LOCK_KEY = 'sync_lock';
  private static readonly LOCK_TIMEOUT = 30000; // 30 secondes

  static async acquire(): Promise<boolean> {
    try {
      const timestamp = Date.now();
      const { data, error } = await supabase
        .from('sync_locks')
        .insert([
          { 
            key: this.LOCK_KEY, 
            acquired_at: new Date(timestamp).toISOString(),
            expires_at: new Date(timestamp + this.LOCK_TIMEOUT).toISOString()
          }
        ])
        .select()
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  static async release(): Promise<void> {
    await supabase
      .from('sync_locks')
      .delete()
      .eq('key', this.LOCK_KEY);
  }

  static async isLocked(): Promise<boolean> {
    const { data } = await supabase
      .from('sync_locks')
      .select('expires_at')
      .eq('key', this.LOCK_KEY)
      .single();

    if (!data) return false;

    const expiresAt = new Date(data.expires_at).getTime();
    return Date.now() < expiresAt;
  }
}