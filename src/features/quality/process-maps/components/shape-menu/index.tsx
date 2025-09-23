// process-maps/components/shape-menu/index.tsx
import { Box, Typography } from "@mui/material";
import ShapeMenuItem from "./shape-menu-item";
import { shapes, type ShapeType } from "../shape/types";

export default function ShapeMenu() {
  return (
    <Box sx={{ width: 1 }}>
      <Typography variant="caption" sx={{ mb: 1, px: 0.5, fontWeight: 600 }}>
        Drag shapes to the canvas
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        }}
      >
        {shapes.map((s) => (
          <ShapeMenuItem key={s.id} type={s.id as ShapeType} />
        ))}
      </Box>
    </Box>
  );
}
