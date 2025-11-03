//src/features/scheduling/pages/SchedulingLandingPage.tsx

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
//import Example from "../components/Example";

export default function SchedulingLandingPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // IMPORTANT
        width: "100%", // IMPORTANT
      }}
    >
      <Box
        sx={{
          flex: 1, // take up remaining space
          overflow: "auto", // scroll if content is taller
        }}
      >
        {" "}
        <Typography>A bunch of links and widgets will show here</Typography>
      </Box>
    </Box>
  );
}
