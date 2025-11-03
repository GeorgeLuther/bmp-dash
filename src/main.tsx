//src/main.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import { SessionProvider } from "@/features/auth/session/SessionContext";
import { UserProvider } from "@/features/auth/user/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </SessionProvider>
  </React.StrictMode>
);
