-- Supprime les tables existantes
DROP TABLE IF EXISTS inventory CASCADE;

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

-- Active RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Crée les politiques
CREATE POLICY "Enable read access for all users" 
  ON inventory FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for all users" 
  ON inventory FOR ALL 
  USING (true);

-- Crée les index pour améliorer les performances
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_in_stock ON inventory(in_stock);

-- Accorde les permissions
GRANT ALL ON inventory TO authenticated;
GRANT ALL ON inventory TO anon;

-- Active realtime
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;