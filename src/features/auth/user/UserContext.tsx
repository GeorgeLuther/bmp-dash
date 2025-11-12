// src/features/auth/user/UserContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserContextValue, UserCtxStatus, CurrentUser } from "./types";
import { fetchCurrentUser } from "./api";
import { useSession } from "@/features/auth/session/useSession";

export const Ctx = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { status: authStatus, session } = useSession();

  const [ctxStatus, setCtxStatus] = useState<UserCtxStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // Gate on auth: if auth isn't ready or user not signed in, we're still "loading"
    if (authStatus !== "ready" || !session?.userId) {
      setCtxStatus("loading");
      setUser(null);
      setError(null);
      return;
    }

    setCtxStatus("loading");
    setError(null);

    try {
      const u = await fetchCurrentUser();

      if (!u) {
        // RLS denied or no profile row
        setUser(null);
        setCtxStatus("forbidden");
        setError(null);
        return;
      }

      setUser(u);
      setCtxStatus("ready");
      setError(null);
    } catch (e: any) {
      // Real error
      setUser(null);
      setCtxStatus("forbidden");
      setError(e?.message ?? "Failed to load user context");
    }
  }, [authStatus, session?.userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const value: UserContextValue = useMemo(
    () => ({
      ctxStatus,
      user,
      error,
      refresh: load,
    }),
    [ctxStatus, user, error, load]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
