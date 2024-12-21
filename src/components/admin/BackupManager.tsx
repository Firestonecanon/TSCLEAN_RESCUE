import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { backupService } from '@/lib/backup/service';
import type { Backup } from '@/lib/backup/types';
import { useInventory } from '@/contexts/InventoryContext';

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadInventory } = useInventory();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setError(null);
      const data = await backupService.list();
      setBackups(data);
    } catch (err) {
      setError('Erreur lors du chargement des sauvegardes');
    }
  };

  const createBackup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const description = prompt('Description de la sauvegarde (optionnel):');
      await backupService.create(description || undefined);
      await loadBackups();
    } catch (err) {
      setError('Erreur lors de la création de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Les données actuelles seront remplacées.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await backupService.restore(backupId);
      await loadInventory();
    } catch (err) {
      setError('Erreur lors de la restauration');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await backupService.delete(backupId);
      await loadBackups();
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sauvegardes</h2>
        <button
          onClick={createBackup}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          Nouvelle sauvegarde
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {backups.map((backup) => (
          <div
            key={backup.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">
                {new Date(backup.timestamp).toLocaleString()}
              </p>
              {backup.metadata.description && (
                <p className="text-sm text-gray-600">
                  {backup.metadata.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => restoreBackup(backup.id)}
                disabled={isLoading}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Restaurer"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => deleteBackup(backup.id)}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {backups.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Aucune sauvegarde disponible
          </p>
        )}
      </div>
    </div>
  );
}