// src/app/router/boundaries/NotFound.tsx

import { Box, Button, Stack, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router";

/**
 * Global 404 page for unknown routes.
 * Centered layout, consistent with other router boundaries.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Stack
        spacing={2.5}
        alignItems="center"
        textAlign="center"
        maxWidth={520}
      >
        <SearchOffIcon sx={{ fontSize: 80, color: "text.secondary" }} />

        <Typography variant="h4" component="h1">
          Page not found
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, deleted, or you may not have access to it.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
