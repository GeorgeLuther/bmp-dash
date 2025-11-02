import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SessionContextValue, SessionInfo, SessionStatus } from "./types";
import { supabase } from "@/supabase/client";

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readSession = useCallback(async () => {
    try {
      const { data, error: err } = await supabase.auth.getSession();
      if (err) throw err;
      const s = data?.session ?? null;
      if (!s?.user?.id) {
        setSession(null);
        setStatus("unauthenticated");
        return;
      }
      setSession({
        userId: s.user.id,
        expiresAt: typeof s.expires_at === "number" ? s.expires_at : null,
      });
      setStatus("ready");
      setError(null);
    } catch (e: any) {
      setSession(null);
      setStatus("unauthenticated");
      setError(e?.message ?? "Session read failed");
    }
  }, []);

  useEffect(() => {
    readSession();
  }, [readSession]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user?.id) {
        setSession({
          userId: s.user.id,
          expiresAt: typeof s.expires_at === "number" ? s.expires_at : null,
        });
        setStatus("ready");
        setError(null);
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
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
