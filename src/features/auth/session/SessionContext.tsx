// src/features/auth/session/SessionContext.tsx
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SessionContextValue, SessionInfo, SessionStatus } from "./types";
import { supabase } from "@/supabase/client";
import type { Session as SupaSession } from "@supabase/supabase-js";

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toSessionInfo = (s: SupaSession | null): SessionInfo | null => {
    if (!s?.user?.id) return null;
    const meta = (s.user.user_metadata as any) ?? {};
    return {
      userId: s.user.id,
      expiresAt: typeof s.expires_at === "number" ? s.expires_at : null,
      name: meta.name || "",
      email: typeof s.user.email === "string" ? s.user.email : "",
      image: meta.avatar_url || "",
    };
  };

  const readSession = useCallback(async () => {
    try {
      const { data, error: err } = await supabase.auth.getSession();
      if (err) throw err;

      const next = toSessionInfo(data?.session ?? null);
      if (!next) {
        setSession(null);
        setStatus("unauthenticated");
        return;
      }
      setSession(next);
      setStatus("ready");
      setError(null);
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in (e as any)
          ? String((e as any).message)
          : "Session read failed";
      setSession(null);
      setStatus("unauthenticated");
      setError(msg);
    }
  }, []);

  useEffect(() => {
    readSession();
  }, [readSession]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      const next = toSessionInfo(s);
      if (next) {
        setSession(next);
        setStatus("ready");
        setError(null);
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    await readSession();
  }, [readSession]);

  const value: SessionContextValue = useMemo(
    () => ({ status, session, error, refresh }),
    [status, session, error, refresh]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
