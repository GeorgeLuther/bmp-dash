import * as React from "react";
import Typography from "@mui/material/Typography";
import ReleasesTable from "../components/tables/ReleaseTable";
//import Example from "../components/Example";

export default function HomePage() {
  return (
    <>
      <Typography>Production Dashboard will show here</Typography>
      <ReleasesTable />
    </>
  );
}
