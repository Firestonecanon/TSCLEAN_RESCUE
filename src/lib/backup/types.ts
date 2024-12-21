export interface Backup {
  id: string;
  timestamp: string;
  data: {
    inventory: any[];
  };
  metadata: {
    version: string;
    description?: string;
  };
}

export interface BackupService {
  create: (description?: string) => Promise<Backup>;
  restore: (backupId: string) => Promise<void>;
  list: () => Promise<Backup[]>;
  delete: (backupId: string) => Promise<void>;
}