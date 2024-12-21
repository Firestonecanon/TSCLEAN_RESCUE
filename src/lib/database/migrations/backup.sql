-- Création de la table backups
CREATE TABLE IF NOT EXISTS backups (
  id text PRIMARY KEY,
  timestamp timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  data jsonb NOT NULL,
  metadata jsonb NOT NULL
);

-- Activer RLS
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
CREATE POLICY "Enable read access for all users" 
  ON backups FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for all users" 
  ON backups FOR ALL 
  USING (true);

-- Créer les index
CREATE INDEX idx_backups_timestamp ON backups(timestamp DESC);

-- Accorder les permissions
GRANT ALL ON backups TO authenticated;
GRANT ALL ON backups TO anon;

-- Activer realtime
ALTER PUBLICATION supabase_realtime ADD TABLE backups;