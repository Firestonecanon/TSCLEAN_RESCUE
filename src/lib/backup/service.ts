import { supabase } from '../database/client';
import type { Backup } from './types';
import { generateBackupId } from './utils';

class BackupService {
  private readonly BACKUP_TABLE = 'backups';

  async initialize(): Promise<void> {
    try {
      // Vérifier si la table existe
      const { error } = await supabase
        .from(this.BACKUP_TABLE)
        .select('id')
        .limit(1);

      // Si la table n'existe pas, on lance une erreur pour informer l'utilisateur
      if (error?.code === '42P01') {
        throw new Error('La table de sauvegarde n\'existe pas. Veuillez exécuter le script SQL de migration.');
      }
    } catch (error) {
      console.error('[Backup] Initialization error:', error);
      throw error;
    }
  }

  async create(description?: string): Promise<Backup> {
    try {
      // 1. Récupérer les données actuelles
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('*');

      if (inventoryError) throw inventoryError;

      // 2. Créer la sauvegarde
      const backup: Backup = {
        id: generateBackupId(),
        timestamp: new Date().toISOString(),
        data: {
          inventory: inventory || [],
        },
        metadata: {
          version: '1.0.0',
          description,
        },
      };

      // 3. Sauvegarder dans la table des backups
      const { error: backupError } = await supabase
        .from(this.BACKUP_TABLE)
        .insert(backup);

      if (backupError) throw backupError;

      return backup;
    } catch (error) {
      console.error('[Backup] Create error:', error);
      throw error;
    }
  }

  async restore(backupId: string): Promise<void> {
    try {
      // 1. Récupérer la sauvegarde
      const { data: backup, error: backupError } = await supabase
        .from(this.BACKUP_TABLE)
        .select('*')
        .eq('id', backupId)
        .single();

      if (backupError) throw backupError;
      if (!backup) throw new Error('Backup not found');

      // 2. Restaurer l'inventaire
      const { error: restoreError } = await supabase
        .from('inventory')
        .upsert(backup.data.inventory, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (restoreError) throw restoreError;
    } catch (error) {
      console.error('[Backup] Restore error:', error);
      throw error;
    }
  }

  async list(): Promise<Backup[]> {
    try {
      const { data, error } = await supabase
        .from(this.BACKUP_TABLE)
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[Backup] List error:', error);
      throw error;
    }
  }

  async delete(backupId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.BACKUP_TABLE)
        .delete()
        .eq('id', backupId);

      if (error) throw error;
    } catch (error) {
      console.error('[Backup] Delete error:', error);
      throw error;
    }
  }
}

export const backupService = new BackupService();