-- Création de la table site_sections
CREATE TABLE IF NOT EXISTS site_sections (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  path text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Activer RLS
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
CREATE POLICY "Enable read access for all users" 
  ON site_sections FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for authenticated users" 
  ON site_sections FOR ALL 
  USING (auth.role() = 'authenticated');

-- Créer les index
CREATE INDEX idx_site_sections_display_order ON site_sections(display_order);
CREATE INDEX idx_site_sections_path ON site_sections(path);

-- Accorder les permissions
GRANT ALL ON site_sections TO authenticated;
GRANT SELECT ON site_sections TO anon;

-- Activer realtime
ALTER PUBLICATION supabase_realtime ADD TABLE site_sections;