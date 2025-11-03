// src/main.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./app/App";
import Layout from "./app/layouts/dashboard";
import SignInPage from "./features/auth/signin";

// Pages

import AccountPage from "./features/account";

import WipPage from "./shared/WorkInProgress"; // placeholder until real pages exist

import SchedulingLandingPage from "./features/scheduling/pages/SchedulingLandingPage";
import AllReleasesPage from "./features/scheduling/pages/AllReleases";
import WeldingSchedule from "./features/scheduling/pages/WeldSchedule";

//import QualityLandingPage from "./features/quality/pages/QualityLandingPage";
import ProcessMapStudio from "./features/quality/process-maps-old/pages/ProcessMapStudio";
import ProcessMapsWrapper from "./features/quality/process-maps";
import StandardPageLayout from "./app/layouts/StandardPageLayout";

import PersonnelPage from "./features/personnel";

import { SessionProvider } from "./features/auth/session/SessionContext";

// IMPORTANT: child paths below MUST match the NAVIGATION "segment" values in App.tsx
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          // Landing page
          {
            path: "scheduling",
            Component: StandardPageLayout,
            children: [
              // {
              //   index: true, // This makes it the default child
              //   Component: QualityLandingPage,
              //   handle: { title: "Quality Overview" },
              // },
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
          // You have a top-level "account" in NAVIGATION → add the route too:
          {
            path: "account",
            Component: AccountPage,
            handle: { title: "Account" },
          },
        ],
      },

      // Auth
      { path: "/sign-in", Component: SignInPage },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
);
