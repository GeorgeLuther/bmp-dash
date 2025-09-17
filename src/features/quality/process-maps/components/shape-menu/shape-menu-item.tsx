import { type DragEvent, useRef } from "react";
import { Grid, Box, useTheme } from "@mui/material";
import { lighten } from "@mui/material/styles";

import Shape from "../shape";
import { type ShapeType, getShapeById } from "../shape/types";
type ShapeMenuItemProps = {
  type: ShapeType;
};

function ShapeMenuItem({ type }: ShapeMenuItemProps) {
  const theme = useTheme();
  const shapeDef = getShapeById(type);
  const color = shapeDef?.meta.defaultColor;
  const strokeColor = lighten(color, 0.3); // Generate a color 30% lighter

  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  return (
    <Grid item xs={3} sx={{ p: 0.5 }}>
      <Box
        ref={dragImageRef}
        draggable
        onDragStart={onDragStart}
        sx={{
          cursor: "pointer",
          borderRadius: 1,
          transition: "transform 0.1s ease-in-out",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            boxShadow: `0 0 8px 1px ${color}`,
            cursor: "grab",
          },
          "&:active": {
            transform: "scale(0.95)",
            backgroundColor: theme.palette.action.selected,
            cursor: "grabbing",
          },
        }}
      >
        <Shape
          type={type}
          fill={color}
          stroke={strokeColor} // Use the new lighter stroke color
          strokeWidth={2}
          width={112}
          height={80}
          title={shapeDef?.meta.label || type}
        />
      </Box>
    </Grid>
  );
}

export default ShapeMenuItem;
