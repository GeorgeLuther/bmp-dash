// src/features/auth/signin.tsx
"use client";

import LinearProgress from "@mui/material/LinearProgress";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Navigate } from "react-router";
import { useSession } from "@/features/auth/session/useSession";
import { supabase } from "@/supabase/client";
import { safeRedirect } from "@/shared/safeRedirect";

export default function SignIn() {
  const { status, session } = useSession();

  const params = new URLSearchParams(window.location.search);
  const callbackUrl = safeRedirect(params.get("callbackUrl"), "/");

  if (status === "loading") return <LinearProgress />;
  if (session) return <Navigate to={callbackUrl} replace />;

  return (
    <SignInPage
      providers={[
        { id: "google", name: "Google" },
        { id: "azure", name: "Microsoft" },
      ]}
      signIn={async (provider, _formData, cbFromToolpad) => {
        try {
          const cb = safeRedirect(
            cbFromToolpad || params.get("callbackUrl"),
            "/"
          );
          // Supabase requires absolute URL; keep same-origin
          const redirectTo = new URL(cb, window.location.origin).href;

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider.id as "google" | "azure",
            options: { redirectTo },
          });

          if (error) return { error: error.message };
          if (data?.url) window.location.assign(data.url);
          return {};
        } catch (e: any) {
          console.error(e);
          return { error: e.message || "Sign-in failed" };
        }
      }}
    />
  );
}
