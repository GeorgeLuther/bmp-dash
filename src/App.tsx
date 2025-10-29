//App.tsx
import * as React from "react";

import { supabase } from "./supabase/client";
(window as any).supabase = supabase;

import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation, Authentication } from "@toolpad/core/AppProvider";

import SessionContext, { type Session } from "./contexts/SessionContext";
import { PersonnelProvider } from "./features/account/contexts/PersonnelContext";

import {
  TableChart,
  CalendarMonth,
  AccountBox,
  Dashboard,
  School,
  Event,
  Groups,
  Verified,
  SchemaOutlined,
  ContentPasteSearch,
  AssignmentTurnedInOutlined,
  Straighten,
  PeopleAlt,
} from "@mui/icons-material";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "scheduling",
    title: "Scheduling",
    icon: <CalendarMonth />,
    children: [
      {
        // This new entry links to the index route at "/scheduling"
        segment: "", // An empty segment points to the parent's path
        title: "Overview",
        icon: <Dashboard />,
      },
      {
        segment: "all_releases",
        title: "All Releases",
        icon: <TableChart />,
      },
      {
        segment: "welding_schedule",
        title: "Welding Schedule",
        icon: <TableChart />,
      },
    ],
  },
  {
    segment: "quality",
    title: "Quality",
    icon: <Verified />,
    children: [
      {
        segment: "process_maps",
        title: "Process Maps",
        icon: <TableChart />,
      },
      {
        segment: "process_maps_new",
        title: "Process Maps New",
        icon: <TableChart />,
      },
    ],
  },
  {
    segment: "personnel",
    title: "Personnel",
    icon: <PeopleAlt />,
    children: [
      {
        segment: "active",
        title: "Active Personnel",
        icon: <TableChart />,
      },
      {
        segment: "former",
        title: "Former Personnel",
        icon: <TableChart />,
      },
      {
        segment: "prospective",
        title: "Prospective Personnel",
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
