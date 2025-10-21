// src/features/personnel/table/peopleColumns.ts
import { Stack, Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { type Person } from "./person.types";

const dfmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export const personColumns: MRT_ColumnDef<Person>[] = [
  // Display name (preferred if present)
  {
    id: "display_name",
    header: "Name",
    accessorFn: (r) =>
      r.preferred_name?.trim()?.length
        ? r.preferred_name!.trim()
        : `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
    sortingFn: "alphanumeric",
    enableColumnFilter: true,
    size: 220,
  },

  { accessorKey: "employment_status", header: "Status", size: 110 },

  // Multiple departments → chips
  {
    id: "departments",
    header: "Departments",
    accessorFn: (r) => r.departments ?? [],
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
    size: 240,
  },

  { accessorKey: "agency", header: "Agency", size: 140 },
  { accessorKey: "email_primary", header: "Email", size: 220 },

  // Pretty dates, sortable via originals in row.original
  {
    id: "started_at_fmt",
    header: "Started",
    accessorFn: (r) =>
      r.started_at ? dfmt.format(new Date(r.started_at)) : "",
    sortingFn: (a, b) =>
      new Date(a.original.started_at ?? 0).getTime() -
      new Date(b.original.started_at ?? 0).getTime(),
    size: 120,
  },
  {
    id: "hired_at_fmt",
    header: "Hired",
    accessorFn: (r) => (r.hired_at ? dfmt.format(new Date(r.hired_at)) : ""),
    sortingFn: (a, b) =>
      new Date(a.original.hired_at ?? 0).getTime() -
      new Date(b.original.hired_at ?? 0).getTime(),
    size: 120,
  },
  {
    id: "created_at_fmt",
    header: "Created",
    accessorFn: (r) =>
      r.created_at ? dfmt.format(new Date(r.created_at)) : "",
    sortingFn: (a, b) =>
      new Date(a.original.created_at ?? 0).getTime() -
      new Date(b.original.created_at ?? 0).getTime(),
    size: 120,
  },

  // Hidden/raw fields kept for export or advanced filters
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
    accessorKey: "started_at",
    header: "Started (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "hired_at",
    header: "Hired (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
  {
    accessorKey: "created_at",
    header: "Created (raw)",
    enableHiding: true,
    enableColumnFilter: false,
    size: 1,
  },
];
