-- Profiles table: uitgebreid met is_admin flag
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin  BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Gebruiker mag zijn eigen profiel lezen
CREATE POLICY "read_own_profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Automatisch profiel aanmaken bij nieuwe registratie
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiel aanmaken voor bestaande gebruikers (als die er al zijn)
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT DO NOTHING;
