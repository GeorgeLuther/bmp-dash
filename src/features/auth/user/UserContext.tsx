// src/features/auth/user/UserContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  UserContextValue,
  UserStatus,
  CurrentUser,
  UserRole,
  Capabilities,
} from "./types";
import { fetchCurrentUser } from "./api";
import { useSession } from "@/features/auth/session/useSession";

const Ctx = createContext<UserContextValue | undefined>(undefined);

// Adjust this to your real rules
function computeCapabilities(roles: UserRole[]): Capabilities {
  const labels = new Set(roles.map((r) => r.role_label));
  return {
    isTopManagement: labels.has("Top Management"),
    canAdminPeople: labels.has("HR") || labels.has("Top Management"),
    canEditDocs: labels.has("Quality Manager") || labels.has("Top Management"),
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { status: authStatus, session } = useSession();
  const [status, setStatus] = useState<UserStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // Gate on auth
    if (authStatus !== "ready" || !session?.userId) {
      setStatus("loading");
      setUser(null);
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const u = await fetchCurrentUser();

      if (!u) {
        // RLS denied or no profile row
        setUser(null);
        setStatus("forbidden");
        setError(null);
        return;
      }

      setUser(u);
      setStatus("ready");
      setError(null);
    } catch (e: any) {
      // Real error: keep status forbidden (no separate enum), but surface message
      setUser(null);
      setStatus("forbidden");
      setError(e?.message ?? "Failed to load user context");
    }
  }, [authStatus, session?.userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const roles = user?.roles ?? [];
  const capabilities = useMemo(() => computeCapabilities(roles), [roles]);

  const value: UserContextValue = useMemo(
    () => ({
      status,
      user,
      roles,
      capabilities,
      error,
      refresh: load,
    }),
    [status, user, roles, capabilities, error, load]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUser must be used within a UserProvider");
  return v;
}
