import * as React from "react";
import {
  Box,
  SwipeableDrawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  SvgRect,
  SvgCircle,
  SvgDiamond,
  SvgDocument,
  SvgDatabase,
} from "./shapes/ShapeSvgs";

export type ShapeItem = {
  id: string;
  label: string;
  kind: "basic" | "flow" | "annotation";
  icon?: React.ReactNode;
};

const DEFAULT_SHAPES: ShapeItem[] = [
  { id: "rect", label: "Rectangle", kind: "basic", icon: <SvgRect /> },
  { id: "circle", label: "Circle", kind: "basic", icon: <SvgCircle /> },
  { id: "decision", label: "Decision", kind: "flow", icon: <SvgDiamond /> },
  {
    id: "process",
    label: "Process",
    kind: "flow",
    icon: <SvgRect radius={6} />,
  },
  {
    id: "document",
    label: "Document",
    kind: "annotation",
    icon: <SvgDocument />,
  },
  { id: "db", label: "Database", kind: "annotation", icon: <SvgDatabase /> },
];

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInsert?: (shape: ShapeItem) => void;
  shapes?: ShapeItem[];
  initialHeight?: number;
  containerEl?: HTMLElement | null; // 👈 NEW
};

export default function ShapeLibraryDrawer({
  open,
  onOpen,
  onClose,
  onInsert,
  shapes = DEFAULT_SHAPES,
  initialHeight = 320,
  containerEl,
}: Props) {
  const theme = useTheme();
  const [height, setHeight] = React.useState<number>(initialHeight);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return shapes.filter(
      (s) =>
        !q ||
        s.label.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }, [shapes, query]);

  // drag-to-resize
  const dragRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = dragRef.current;
    if (!el) return;

    let startY = 0;
    let startH = height;

    const onPointerDown = (e: PointerEvent) => {
      startY = e.clientY;
      startH = height;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };
    const onPointerMove = (e: PointerEvent) => {
      const dy = startY - e.clientY;
      setHeight(Math.max(200, Math.min(640, startH + dy)));
    };
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    el.addEventListener("pointerdown", onPointerDown);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [height]);

  const handleDragStart = (e: React.DragEvent, shape: ShapeItem) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(shape));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableDiscovery
      disableSwipeToOpen
      container={containerEl ?? undefined} // 👈 render inside content box
      ModalProps={{
        container: containerEl ?? undefined,
        disablePortal: true, // 👈 no portal to <body>
        keepMounted: true,
        hideBackdrop: true, // 👈 no backdrop
        disableScrollLock: true, // 👈 don’t mess with body scroll
      }}
      PaperProps={{
        sx: {
          height,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          zIndex: theme.zIndex.modal,
        },
      }}
    >
      {/* drag handle */}
      <Box
        ref={dragRef}
        sx={{
          position: "relative",
          cursor: "ns-resize",
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::after": {
            content: '""',
            width: 40,
            height: 4,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.text.primary, 0.3),
          },
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 2, pb: 1 }}
      >
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Shape Library
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {/* search only (pills removed) */}
      <Stack spacing={1.5} sx={{ px: 2, pb: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search shapes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Stack>

      <Box sx={{ px: 2, pb: 2, overflow: "auto", height: `calc(100% - 90px)` }}>
        <Grid container spacing={1.5}>
          {filtered.map((sh) => (
            <Grid key={sh.id} item xs={6} sm={4} md={3} lg={2}>
              <Paper
                role="button"
                draggable
                onDragStart={(e) => handleDragStart(e, sh)}
                onClick={() => onInsert?.(sh)}
                elevation={1}
                sx={{
                  p: 1.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 2,
                  cursor: "grab",
                  color: theme.palette.text.primary, // SVGs inherit this
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  "&:hover": {
                    boxShadow: 2,
                    backgroundColor: alpha(theme.palette.action.hover, 0.6),
                  },
                }}
              >
                <Box sx={{ display: "grid", placeItems: "center" }}>
                  {sh.icon}
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }} noWrap>
                  {sh.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SwipeableDrawer>
  );
}
