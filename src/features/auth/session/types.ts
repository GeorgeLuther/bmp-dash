// src/features/auth/session/types.ts
export type SessionStatus = 'loading' | 'unauthenticated' | 'ready';

export interface SessionInfo {
  userId: string;
  expiresAt?: number | null;
  name?: string;
  email?: string;
  image?: string;
}

export interface SessionContextValue {
  status: SessionStatus;
  session: SessionInfo | null;
  error: string | null;      // keep it simple
  refresh: () => Promise<void>;
}
