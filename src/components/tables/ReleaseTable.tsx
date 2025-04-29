import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { releaseData } from "../../__tests__/data/testReleaseData";
import { releaseColumns } from "./ReleaseTable.columns";

// Assuming Release is defined in testReleaseData
const ReleasesTable = () => {
  const table = useMaterialReactTable({
    columns: releaseColumns, //column definition (should be memoized or stable)
    data: releaseData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default ReleasesTable;
