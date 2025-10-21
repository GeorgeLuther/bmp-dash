// src/features/personnel/profile-drawer/index.tsx
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = { personId: string | null; onClose: () => void };

export default function ProfileDrawer({ personId, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={Boolean(personId)}
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
        <Typography variant="h6">Person profile</Typography>
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box p={2}>
        <Typography color="text.secondary">Coming soon.</Typography>
      </Box>
    </Drawer>
  );
}
