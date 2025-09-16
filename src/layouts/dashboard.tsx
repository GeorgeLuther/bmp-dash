// dashboard.tsx

import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation, useMatches } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";

import { useSession } from "../contexts/SessionContext";

function CustomAccount() {
  return (
    <Account
      slotProps={{
        preview: { slotProps: { avatarIconButton: { sx: { border: "0" } } } },
      }}
    />
  );
}

export default function Layout() {
  const { session, loading } = useSession();
  const location = useLocation();

  const matches = useMatches();
  const leaf = matches[matches.length - 2];
  console.log(leaf);

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  if (!session) {
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
      <Outlet />
    </DashboardLayout>
  );
}
