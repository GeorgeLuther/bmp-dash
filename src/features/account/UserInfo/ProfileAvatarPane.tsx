import React from "react";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";

export default function ProfileAvatarPane() {
  return (
    <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
      <Avatar
        sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
        src=""
        alt="Profile"
      />
      <Button variant="contained" disabled>
        Upload Photo
      </Button>
      <Typography variant="body2" color="text.secondary" mt={2}>
        Avatar editing in development
      </Typography>
    </Paper>
  );
}
