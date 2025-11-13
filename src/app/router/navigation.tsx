// src/app/router/navigation.tsx
import type { Navigation } from "@toolpad/core/AppProvider";
import {
  TableChart,
  CalendarMonth,
  AccountBox,
  Dashboard,
  Verified,
  PeopleAlt,
} from "@mui/icons-material";

export const NAVIGATION: Navigation = [
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

export const BRANDING = { title: "bmp-dash" };
