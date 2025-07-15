import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ActionMenuItem,
  type MRT_Row,
} from "material-react-table";

import { Edit, Delete } from "@mui/icons-material";
import RightDrawer from "./ReleaseDrawer";
import { Release } from "../../../types/Release";

import { releaseColumns } from "./ReleaseTable.columns";
import { useReleases } from "@/hooks/getAllReleases";

// Assuming Release is defined in testReleaseData
const ReleasesTable = () => {
  const { data: releaseData, isLoading, error } = useReleases();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Release | null>(null);

  const handleOpenDrawer = (row: MRT_Row<Release>) => {
    setSelectedRowData(row.original);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRowData(null);
  };

  return (
    <>
      <MaterialReactTable
        columns={releaseColumns}
        data={releaseData}
        muiTablePaperProps={{
          sx: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          },
        }}
        // and the table body to scroll inside it:
        muiTableContainerProps={{
          sx: {
            flex: 1,
            minHeight: 0, // allow inner scrolling
          },
        }}
        enableRowActions
        renderRowActionMenuItems={({ row, table, closeMenu }) => [
          <MRT_ActionMenuItem //or just use a normal MUI MenuItem component
            icon={<Edit />}
            key="edit"
            label="Edit"
            onClick={() => {
              handleOpenDrawer(row); // Open drawer on edit click
              console.info("Edit", row.original);
              closeMenu();
            }}
            table={table}
          />,
          <MRT_ActionMenuItem
            icon={<Delete />}
            key="delete"
            label="Delete"
            onClick={() => {
              console.info("Delete", row.original);
              closeMenu();
            }}
            table={table}
          />,
        ]}
      />
      {/* Render the drawer conditionally only when selectedRowData is not null */}
      {selectedRowData && (
        <RightDrawer
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          rowData={selectedRowData}
        />
      )}
    </>
  );
};

export default ReleasesTable;
