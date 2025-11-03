// src/app/App.tsx
import * as React from "react";
import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation, Authentication } from "@toolpad/core/AppProvider";
import { supabase } from "@/supabase/client";
import { useSession } from "@/features/auth/session/useSession";

import {
  TableChart,
  CalendarMonth,
  AccountBox,
  Dashboard,
  Verified,
  PeopleAlt,
} from "@mui/icons-material";

const NAVIGATION: Navigation = [
  { kind: "header", title: "Main items" },
  {
    segment: "scheduling",
    title: "Scheduling",
    icon: <CalendarMonth />,
    children: [
      { segment: "", title: "Overview", icon: <Dashboard /> },
      { segment: "all_releases", title: "All Releases", icon: <TableChart /> },
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
      { segment: "process_maps", title: "Process Maps", icon: <TableChart /> },
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
      { segment: "active", title: "Active Personnel", icon: <TableChart /> },
      { segment: "former", title: "Former Personnel", icon: <TableChart /> },
      {
        segment: "prospective",
        title: "Prospective Personnel",
        icon: <TableChart />,
      },
    ],
  },
  { segment: "account", title: "Account", icon: <AccountBox /> },
];

const BRANDING = { title: "bmp-dash" };

const AUTHENTICATION: Authentication = {
  signIn: () => {}, // handled by /sign-in route
  signOut: async () => {
    await supabase.auth.signOut();
  },
};

export default function App() {
  const { session } = useSession();

  //for toolpad header
  const toolpadSession = React.useMemo(
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
    [session?.name, session?.email, session?.image]
  );

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={toolpadSession}
      authentication={AUTHENTICATION}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
