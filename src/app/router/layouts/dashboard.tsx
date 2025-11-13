// src/app/router/layouts/dashboard.tsx
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation, useMatches } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";

import { useSession } from "@/features/auth/session/useSession";
import { safeRedirect } from "@/shared/helpers/safeRedirect";

function CustomAccount() {
  return (
    <Account
      slotProps={{
        preview: { slotProps: { avatarIconButton: { sx: { border: 0 } } } },
      }}
    />
  );
}

export default function Layout() {
  const { status, session } = useSession();
  const location = useLocation();

  const matches = useMatches();
  const leaf = matches[matches.length - 2];
  //if (leaf) console.log(leaf);

  if (status === "loading") {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  if (!session) {
    const raw = location.pathname + location.search + location.hash;
    const cb = encodeURIComponent(safeRedirect(raw, "/"));
    return <Navigate to={`/sign-in?callbackUrl=${cb}`} replace />;
  }

  return (
    <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
      <Outlet />
    </DashboardLayout>
  );
}
