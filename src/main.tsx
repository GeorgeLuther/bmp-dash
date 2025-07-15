import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import AllReleasesPage from "./features/scheduling/pages";
//import WeldPage from "./pages/weld";
import SignInPage from "./pages/signin";
import AccountPage from "./pages/account";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            index: true,
            Component: AllReleasesPage,
          },
          {
            path: "all_releases",
            Component: AllReleasesPage,
          },
          {
            path: "account",
            Component: AccountPage,
          },
        ],
      },
      {
        path: "/sign-in",
        Component: SignInPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
