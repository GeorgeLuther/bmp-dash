// src/app/App.tsx
import { useMemo } from "react";
import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Authentication } from "@toolpad/core/AppProvider";
import { supabase } from "@/supabase/client";
import { useSession } from "@/features/auth/session/useSession";
// ...
import { NAVIGATION, BRANDING } from "@/app/router/navigation";
// (remove the old inline NAVIGATION/BRANDING)

const AUTHENTICATION: Authentication = {
  signIn: () => {}, // handled by /sign-in route
  signOut: async () => {
    await supabase.auth.signOut();
  },
};

export default function App() {
  const { session } = useSession();

  //for toolpad header
  const TP_SESSION = useMemo(
    () =>
      session
        ? {
            user: {
              name: session.name || "",
              email: session.email || "",
              image: session.image || "",
            },
          }
        : null,
    [session]
  );

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={TP_SESSION}
      authentication={AUTHENTICATION}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
