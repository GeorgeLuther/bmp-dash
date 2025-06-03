// src/pages/UserProfilePage.tsx
import React from "react";
import { Typography, Container } from "@mui/material";
import { usePersonnel } from "@/contexts/PersonnelContext";
import { UserInfo } from "@/components/UserInfo/UserInfo";

export default function UserProfilePage() {
  const { personnel, loading } = usePersonnel(); // get the current signed-in user’s info

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Display user info card */}
      {personnel && <UserInfo personnel={personnel} loading={loading} />}

      {/* Optional: show loading state or message if needed */}
      {!personnel && loading && (
        <Typography variant="body1">Loading your profile...</Typography>
      )}
      {!personnel && !loading && (
        <Typography variant="body1" color="error">
          Unable to load your profile.
        </Typography>
      )}
    </Container>
  );
}
