import React, { useState } from "react";
import ProfileAvatarPane from "./ProfileAvatarPane";
import ProfileDetails from "./ProfileDetails";
import { Grid, Stack, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Profile</Typography>
        <IconButton onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <CloseIcon /> : <EditIcon />}
        </IconButton>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProfileAvatarPane />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProfileDetails editable={isEditing} />
        </Grid>
      </Grid>
    </>
  );
}
