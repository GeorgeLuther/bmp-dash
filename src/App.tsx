import * as React from "react";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import TableChart from "@mui/icons-material/TableChart";
import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation, Authentication } from "@toolpad/core/AppProvider";
import { supabase } from "./supabase/client";
(window as any).supabase = supabase;
import SessionContext, { type Session } from "./contexts/SessionContext";
import { PersonnelProvider } from "./contexts/PersonnelContext";
import { AccountBox } from "@mui/icons-material";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Scheduling",
    icon: <CalendarMonth />,
    children: [
      {
        segment: "all_releases",
        title: "All Releases",
        icon: <TableChart />,
      },
    ],
  },
  {
    segment: "account",
    title: "Account",
    icon: <AccountBox />,
  },
];

const BRANDING = {
  title: "bmp-dash",
};

const AUTHENTICATION: Authentication = {
  signIn: () => {},
  signOut: async () => {
    await supabase.auth.signOut();
  },
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading]
  );

  React.useEffect(() => {
    // 1) fetch initial session
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (s) {
        setSession({
          user: {
            name: (s.user.user_metadata as any).name || "",
            email: s.user.email || "",
            image: (s.user.user_metadata as any).avatar_url || "",
          },
        });
      }
      setLoading(false);
    });

    // 2) subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        setSession({
          user: {
            name: (s.user.user_metadata as any).name || "",
            email: s.user.email || "",
            image: (s.user.user_metadata as any).avatar_url || "",
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={AUTHENTICATION}
    >
      <SessionContext.Provider value={sessionContextValue}>
        <PersonnelProvider>
          <Outlet />
        </PersonnelProvider>
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}
