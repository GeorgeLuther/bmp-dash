// src/pages/WIPPage.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

// Define the props for the WIPPage component
interface WIPPageProps {
  title: string;
}

/**
 * A placeholder component for pages that are still under development.
 * It displays a "Coming Soon" message with a descriptive title.
 * @param {WIPPageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered placeholder page.
 */
export default function WipPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        p: 4,
        color: "text.secondary",
      }}
    >
      <ConstructionIcon sx={{ fontSize: 80, color: "grey.400" }} />
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        mt={2}
        color="text.primary"
      >
        Welcome to bmp-dash!
      </Typography>
      <Typography variant="body1">
        This page is currently under development. Please check back later!
      </Typography>
    </Box>
  );
}
