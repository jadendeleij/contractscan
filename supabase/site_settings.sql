-- Voer dit uit in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- Standaardwaarden aanmaken (overschrijft GEEN bestaande waarden)
INSERT INTO public.site_settings (key, value) VALUES
  ('maintenance_mode',         'false'),
  ('maintenance_scheduled_at', ''),
  ('maintenance_message',      ''),
  ('maintenance_end',          '')
ON CONFLICT (key) DO NOTHING;
