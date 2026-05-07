-- Voer dit uit in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.waitlist (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security inschakelen
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anonieme bezoekers mogen hun e-mail toevoegen
CREATE POLICY "allow_public_insert" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Alleen geauthenticeerde gebruikers (jij) mogen de lijst bekijken
CREATE POLICY "allow_authenticated_select" ON public.waitlist
  FOR SELECT TO authenticated
  USING (true);
