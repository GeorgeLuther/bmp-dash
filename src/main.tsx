import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Navigate } from "react-router";

import App from "./App";
import Layout from "./layouts/dashboard";
import SignInPage from "./pages/signin";

// Pages

import AccountPage from "./features/account/Pages/account";

import WipPage from "./pages/WorkInProgress"; // placeholder until real pages exist

import SchedulingLandingPage from "./features/scheduling/pages/SchedulingLandingPage";
import AllReleasesPage from "./features/scheduling/pages/AllReleases";
import WeldingSchedule from "./features/scheduling/pages/WeldSchedule";

//import QualityLandingPage from "./features/quality/pages/QualityLandingPage";
import ProcessMapStudio from "./features/quality/process-maps-old/pages/ProcessMapStudio";
import ProcessMapsWrapper from "./features/quality/processmaps";

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
    <RouterProvider router={router} />
  </React.StrictMode>
);
