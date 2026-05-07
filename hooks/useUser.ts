"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  loading: boolean;
};

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({ user: null, loading: true });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!cancelled) setState({ user: data.user, loading: false });
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
