-- Supprime les tables existantes
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS sync_locks CASCADE;

-- Crée la table inventory
CREATE TABLE inventory (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image text,
  category text NOT NULL,
  variant text,
  size text,
  quantity integer NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT false,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Crée la table sync_locks pour la gestion des verrous
CREATE TABLE sync_locks (
  key text PRIMARY KEY,
  acquired_at timestamp with time zone NOT NULL,
  expires_at timestamp with time zone NOT NULL
);

-- Active RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_locks ENABLE ROW LEVEL SECURITY;

-- Crée les politiques
CREATE POLICY "Enable read access for all users" 
  ON inventory FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for all users" 
  ON inventory FOR ALL 
  USING (true);

CREATE POLICY "Enable all access to sync_locks" 
  ON sync_locks FOR ALL 
  USING (true);

-- Accorde les permissions
GRANT ALL ON inventory TO authenticated;
GRANT ALL ON inventory TO anon;
GRANT ALL ON sync_locks TO authenticated;
GRANT ALL ON sync_locks TO anon;

-- Active realtime
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;