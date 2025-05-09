import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Release } from "./types/Release";

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  rowData: Release;
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  open,
  onClose,
  rowData,
}) => {
  const theme = useTheme();
  const appBarHeight = theme.mixins.toolbar.minHeight;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "50vw",
          paddingTop: `${appBarHeight}px`, // Apply paddingTop to the PaperProps
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(1, 2),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {rowData.releaseCode || "Job Number"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: theme.spacing(2) }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {rowData.jobName || "Job Name"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Release Information:
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {Object.entries(rowData).map(([key, value]) => (
          <Typography key={key} variant="body2">
            {key}: {String(value)}
          </Typography>
        ))}
      </Box>
    </Drawer>
  );
};

export default RightDrawer;
