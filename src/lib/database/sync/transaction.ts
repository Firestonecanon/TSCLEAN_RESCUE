import { supabase } from '../client';

export class TransactionManager {
  private static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
      }
    }
    
    throw lastError;
  }

  static async executeInTransaction<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    return this.withRetry(async () => {
      const { data: client } = await supabase.rpc('begin_transaction');
      
      try {
        const result = await operation();
        await supabase.rpc('commit_transaction');
        return result;
      } catch (error) {
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    });
  }
}