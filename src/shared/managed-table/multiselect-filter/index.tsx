// src/shared/ui/MultiSelectFilter.tsx
import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import type { MRT_Column, MRT_RowData } from "material-react-table";

type Props<TData extends MRT_RowData> = {
  column: MRT_Column<TData>;
  label?: string;
};

export default function MultiSelectFilter<TData extends MRT_RowData>({
  column,
  label,
}: Props<TData>) {
  const options = useMemo(() => {
    const m = column.getFacetedUniqueValues?.();
    const arr = m ? (Array.from(m.keys()) as string[]) : [];
    return arr.filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [column]);

  const value = (column.getFilterValue() as string[] | undefined) ?? [];

  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={value}
      onChange={(_, v) => column.setFilterValue(v.length ? v : undefined)}
      renderInput={(p) => (
        <TextField
          {...p}
          label={label ?? (column.columnDef.header as string)}
        />
      )}
      sx={{ minWidth: 220 }}
    />
  );
}
