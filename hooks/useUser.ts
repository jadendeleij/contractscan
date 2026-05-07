"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  loading: boolean;
};

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({ user: null, loading: true });

  useEffect(() => {
    const supabase = createClient();

    // Haal huidige sessie op bij mount
    supabase.auth.getUser().then(({ data }) => {
      setState({ user: data.user, loading: false });
    });

    // Luister naar auth-wijzigingen (inloggen, uitloggen, token-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
