// src/app/router/router.tsx
import { createBrowserRouter } from "react-router";

import App from "@/app/App";
import Layout from "@/app/router/layouts/dashboard";
import SignInPage from "@/features/auth/signin";

// Pages
import AccountPage from "@/features/account";

import ErrorBoundary from "@/app/router/boundaries/ErrorBoundary";
import NotFound from "@/app/router/boundaries/NotFound";
import ComingSoon from "@/app/router/boundaries/ComingSoon";

//import SchedulingLandingPage from "@/features/scheduling/pages/SchedulingLandingPage";
import AllReleasesPage from "@/features/scheduling/pages/AllReleases";
import WeldingSchedule from "@/features/scheduling/pages/WeldSchedule";
import ProcessMapStudio from "@/features/quality/process-maps-old/pages/ProcessMapStudio";
import ProcessMapsWrapper from "@/features/quality/process-maps";
import StandardPageLayout from "@/app/router/layouts/ContainedPage";
import PersonnelPage from "@/features/personnel";

// IMPORTANT: child paths MUST match NAVIGATION segment values.
export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "scheduling",
            Component: StandardPageLayout,
            children: [
              // If you add an index page later:
              // { index: true, Component: SchedulingLandingPage, handle: { title: "Scheduling Overview" } },
              {
                path: "all_releases",
                Component: AllReleasesPage,
                handle: { title: "All Releases" },
              },
              {
                path: "welding_schedule",
                Component: WeldingSchedule,
                handle: { title: "Welding Schedules" },
              },
            ],
          },
          {
            path: "quality",
            children: [
              {
                path: "process_maps",
                Component: ProcessMapStudio,
                handle: { title: "Process Map Studio" },
              },
              {
                path: "process_maps_new",
                Component: ProcessMapsWrapper,
                handle: { title: "Process Map Studio", fullBleed: true },
              },
            ],
          },
          {
            path: "personnel",
            Component: StandardPageLayout,
            children: [
              {
                path: "active",
                Component: PersonnelPage,
                handle: { title: "Active Personnel" },
              },
              {
                path: "former",
                Component: PersonnelPage,
                handle: { title: "Former Personnel" },
              },
              {
                path: "prospective",
                Component: PersonnelPage,
                handle: { title: "Prospective Personnel" },
              },
            ],
          },
          {
            path: "account",
            Component: AccountPage,
            handle: { title: "Account" },
          },
          {
            path: "*",
            Component: NotFound,
            handle: { title: "Page Not Found" },
          },
        ],
      },
      { path: "/sign-in", Component: SignInPage },
    ],
  },
]);
