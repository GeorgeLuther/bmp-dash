// src/features/personnel/table/columns.ts
import { Stack, Chip } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";
import type { Person } from "./person.types";

const dfmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export const personColumns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: "display_name",
    header: "Name",
    sortingFn: "alphanumeric",
    enableColumnFilter: true,
    size: 220,
  },
  { accessorKey: "status_label", header: "Status", size: 120 },
  {
    id: "departments",
    header: "Departments",
    accessorFn: (r) => r.departments?.map((d) => d.department_label) ?? [],
    filterFn: "arrIncludesSome",
    Cell: ({ cell }) => {
      const deps = cell.getValue<string[]>();
      if (!deps?.length) return null;
      return (
        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
          {deps.map((d) => (
            <Chip key={d} size="small" label={d} />
          ))}
        </Stack>
      );
    },
    size: 260,
  },
  { accessorKey: "primary_email_address", header: "Main Email", size: 240 },

  {
    id: "latest_hired_at_fmt",
    header: "Latest Hire",
    accessorFn: (r) =>
      r.latest_hired_at ? dfmt.format(new Date(r.latest_hired_at)) : "",
    sortingFn: (a, b) =>
      new Date(a.original.latest_hired_at ?? 0).getTime() -
      new Date(b.original.latest_hired_at ?? 0).getTime(),
    size: 130,
  },
  {
    id: "end_at_fmt",
    header: "Ended",
    accessorFn: (r) => (r.end_at ? dfmt.format(new Date(r.end_at)) : ""),
    sortingFn: (a, b) =>
      new Date(a.original.end_at ?? 0).getTime() -
      new Date(b.original.end_at ?? 0).getTime(),
    size: 120,
  },
  {
    id: "created_fmt",
    header: "Created",
    accessorFn: (r) =>
      r.record_created_at ? dfmt.format(new Date(r.record_created_at)) : "",
    sortingFn: (a, b) =>
      new Date(a.original.record_created_at ?? 0).getTime() -
      new Date(b.original.record_created_at ?? 0).getTime(),
    size: 120,
  },

  // Hidden/raw fields available for filters/exports
  {
    accessorKey: "first_name",
    header: "First",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "last_name",
    header: "Last",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "preferred_name",
    header: "Preferred",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "first_hired_at",
    header: "First Hired (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "latest_hired_at",
    header: "Latest Hired (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "end_at",
    header: "Ended (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "record_created_at",
    header: "Created (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
];
