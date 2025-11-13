// src/app/layouts/boundaries/ErrorBoundary.tsx

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Collapse,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

/**
 * Global route-level error boundary for React Router.
 * Use as `errorElement` in your root layout route.
 */
export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const isDev = import.meta.env.DEV;

  let title = "Something went wrong";
  let message =
    "An unexpected error occurred while loading this page. You can try again, or go back to the main dashboard.";
  let technicalSummary: string | undefined;

  if (isRouteErrorResponse(error)) {
    // "Thrown Response" from a loader or action
    if (error.status === 404) {
      title = "Page not found";
      message =
        "Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or you may not have access to it.";
    } else if (error.status >= 500) {
      title = "Server error";
      message =
        "The server ran into a problem while processing this request. Please try again, or contact support if it continues.";
    } else {
      title = "Request failed";
      message = `The server responded with a ${error.status} – ${error.statusText}. Please try reloading the page.`;
    }

    if (isDev) {
      technicalSummary = JSON.stringify(
        {
          status: error.status,
          statusText: error.statusText,
          data: error.data,
        },
        null,
        2
      );
    }
  } else if (error instanceof Error) {
    // Standard JS error (from loaders/actions/components)
    if (isDev) {
      technicalSummary = `${error.name}: ${error.message}\n\n${
        error.stack ?? ""
      }`;
    } else {
      message =
        "We hit a technical problem while loading this page. The error has been logged. Please try reloading or return to the dashboard.";
    }
  } else if (isDev) {
    // Catch-all for non-Error, non-Response thrown values
    technicalSummary = JSON.stringify(error, null, 2);
  }

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
      <Card
        sx={{
          width: "100%",
          maxWidth: 720,
          textAlign: "center",
        }}
        elevation={3}
      >
        <CardContent>
          <Stack spacing={2.5} alignItems="center">
            <ErrorOutlineIcon sx={{ fontSize: 56 }} color="error" />

            <Typography variant="h4" component="h1">
              {title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520 }}
            >
              {message}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              <Button variant="contained" onClick={() => navigate("/")}>
                Back to dashboard
              </Button>

              <Button variant="outlined" onClick={() => navigate(0)}>
                Reload page
              </Button>
            </Stack>

            {isDev && technicalSummary && (
              <Stack sx={{ width: "100%", pt: 1.5 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowDetails((prev) => !prev)}
                  sx={{ color: "text.secondary" }}
                >
                  {showDetails
                    ? "Hide technical details"
                    : "Show technical details"}
                </Button>

                <Collapse in={showDetails} sx={{ width: "100%", mt: 1 }}>
                  <Box
                    component="pre"
                    sx={{
                      textAlign: "left",
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "grey.900",
                      color: "grey.100",
                      fontSize: 12,
                      maxHeight: 260,
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {technicalSummary}
                  </Box>
                </Collapse>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
