// components/BottomSheet.tsx
import { Box, Typography } from "@mui/material";
import { ExpandLess, ExpandMore, MenuBook } from "@mui/icons-material";

export default function BottomSheet({
  open,
  onToggle,
  children,
  expandedHeight = "40vh",
  collapsedHeight = 40,
  label = "Shape Menu",
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  expandedHeight?: number | string;
  collapsedHeight?: number | string;
  label?: string;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: open ? "auto" : collapsedHeight,
        transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: "background.paper",
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        boxShadow: 6,
        zIndex: (t) => t.zIndex.modal, // stays above the canvas/controls
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header / handle bar */}
      <Box
        onClick={onToggle}
        role="button"
        aria-expanded={open}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          height: collapsedHeight,
          cursor: "pointer",
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          userSelect: "none",
        }}
      >
        <MenuBook fontSize="small" />
        <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
          {label}
        </Typography>
        {open ? (
          <ExpandMore fontSize="small" />
        ) : (
          <ExpandLess fontSize="small" />
        )}
      </Box>

      {/* Content */}
      {open ? (
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>
      ) : null}
    </Box>
  );
}
