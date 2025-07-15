// src/components/UserInfo.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

// Props: accepts a personnel record and optional loading flag
type Props = {
  personnel: {
    first_name: string;
    last_name: string;
    preferred_name?: string;
    created_at?: string;
  };
  loading?: boolean;
};

export const UserInfo = ({ personnel, loading = false }: Props) => {
  if (loading) {
    // Show a loader while fetching
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={120}
      >
        <CircularProgress />
      </Box>
    );
  }

  const { first_name, last_name, preferred_name, created_at } = personnel;

  return (
    <Card sx={{ maxWidth: 400, margin: "1rem auto" }}>
      <CardContent>
        <Typography variant="h6">
          {preferred_name ?? first_name} {last_name}
        </Typography>

        {preferred_name && (
          <Typography variant="body2" color="text.secondary">
            Full name: {first_name} {last_name}
          </Typography>
        )}

        {created_at && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            Joined: {new Date(created_at).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
