"use client";
import * as React from "react";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Navigate, useNavigate } from "react-router";
import { useSession, type Session } from "./session/SessionContext";
import { supabase } from "@/supabase/client";

export default function SignIn() {
  const { session, setSession, loading } = useSession();
  const navigate = useNavigate();

  if (loading) {
    return <LinearProgress />;
  }
  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <SignInPage
      providers={[
        { id: "google", name: "Google" },
        { id: "azure", name: "Microsoft" },
      ]}
      signIn={async (provider, _formData, callbackUrl) => {
        try {
          const redirectTo = window.location.origin + (callbackUrl || "/");
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider.id as "google" | "azure",
            options: { redirectTo },
          });

          console.log("⚙️ signInWithOAuth returned:", { data, error });

          if (error) return { error: error.message };
          if (data?.url) {
            console.log("➡️ Navigating to:", data.url);
            window.location.assign(data.url);
          }
          return {};
        } catch (e: any) {
          console.error(e);
          return { error: e.message };
        }
      }}
    />
  );
}
