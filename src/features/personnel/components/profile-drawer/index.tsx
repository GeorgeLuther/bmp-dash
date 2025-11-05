import { Drawer, Box, Typography, IconButton, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";

type Props = { personId: string | null; onClose: () => void };

export default function ProfileDrawer({ personId, onClose }: Props) {
  const open = Boolean(personId);
  const [tab, setTab] = React.useState(0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 560 } } }}
    >
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography variant="h6">Person</Typography>
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ px: 2 }}
      >
        <Tab label="Profile" />
        <Tab label="Employment" />
        <Tab label="Roles" />
        <Tab label="Training" />
        <Tab label="Docs" />
        <Tab label="Activity" />
      </Tabs>

      <Box sx={{ p: 2, overflow: "auto", height: "100%" }}>
        {tab === 0 && (
          <Typography color="text.secondary">Profile stub</Typography>
        )}
        {tab === 1 && (
          <Typography color="text.secondary">
            Employment history stub
          </Typography>
        )}
        {tab === 2 && (
          <Typography color="text.secondary">Roles history stub</Typography>
        )}
        {tab === 3 && (
          <Typography color="text.secondary">Training stub</Typography>
        )}
        {tab === 4 && (
          <Typography color="text.secondary">Docs to learn stub</Typography>
        )}
        {tab === 5 && (
          <Typography color="text.secondary">Activity stub</Typography>
        )}
      </Box>
    </Drawer>
  );
}
