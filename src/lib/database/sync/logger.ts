export class SyncLogger {
  private startTime: number = 0;

  start(): void {
    this.startTime = Date.now();
    console.log('[Sync] Début de la synchronisation...');
  }

  success(result: any): void {
    console.log('[Sync] Synchronisation réussie:', result);
  }

  error(error: any): void {
    console.error('[Sync] Erreur de synchronisation:', error);
  }

  end(): void {
    const duration = Date.now() - this.startTime;
    console.log(`[Sync] Fin de la synchronisation (${duration}ms)`);
  }
}