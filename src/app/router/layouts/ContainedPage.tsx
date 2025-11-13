// src/app/router/layouts/ContainedPage.tsx
import { Outlet } from "react-router";
import { PageContainer } from "@toolpad/core/PageContainer";

export default function StandardPageLayout() {
  return (
    <PageContainer maxWidth={false}>
      <Outlet />
    </PageContainer>
  );
}
