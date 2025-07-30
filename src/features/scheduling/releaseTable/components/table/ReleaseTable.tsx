import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ToolbarInternalButtons,
  type MRT_Row,
} from "material-react-table";

import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import SaveIcon from "@mui/icons-material/Save";
import { Edit, Delete } from "@mui/icons-material";

import ReleaseDrawer from "../ReleaseDrawer";
import { Release } from "../../types/Release.types";
import { releaseColumns } from "./ReleaseTable.columns";
import { useReleases } from "@/features/scheduling/releaseTable/hooks/getAllReleases";

const ReleasesTable = () => {
  const { data: releaseData, isLoading } = useReleases();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Release | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const [savedViews, setSavedViews] = useState<
    {
      id: string;
      name: string;
      filters?: any;
      sorting?: any;
      column_visibil?: any;
      column_order?: any;
      grouping?: string[];
    }[]
  >([]);

  const columns = useMemo(() => releaseColumns, []);

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={releaseData ?? []}
        state={{ isLoading }}
        enableRowActions
        enableGrouping
        enableColumnOrdering
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <>
            <IconButton onClick={() => setSelectedRowData(row.original)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => console.log("TODO delete", row)}>
              <Delete />
            </IconButton>
          </>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Tooltip title="View Presets">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Current View">
              <IconButton onClick={() => setSaveDialogOpen(true)}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {savedViews.length === 0 && (
                <MenuItem disabled>No saved views</MenuItem>
              )}
              {savedViews.map((view) => (
                <MenuItem
                  key={view.id}
                  onClick={() => {
                    try {
                      if (view.filters) table.setColumnFilters(view.filters);
                      if (view.sorting) table.setSorting(view.sorting);
                      if (view.column_visibil)
                        table.setColumnVisibility(view.column_visibil);
                      if (view.column_order)
                        table.setColumnOrder(view.column_order);
                    } catch (err) {
                      console.error("Failed to apply view", err);
                    }
                    setAnchorEl(null);
                  }}
                >
                  {view.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      />

      <ReleaseDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        rowData={selectedRowData}
      />
    </>
  );
};

export default ReleasesTable;
