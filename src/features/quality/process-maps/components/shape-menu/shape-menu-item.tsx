import * as React from "react";
import { Paper, ButtonBase, Box, Typography } from "@mui/material";
import Shape from "../shape";
import { getShapeById, type ShapeType } from "../shape/types";

export default function ShapeMenuItem({ type }: { type: ShapeType }) {
  const def = getShapeById(type);
  if (!def) return null;

  const { cols, rows } = def.meta.gridAspect;
  const vw = cols * 24;
  const vh = rows * 24;

  // focus ring drawn on the Paper
  const [focusVisible, setFocusVisible] = React.useState(false);

  // drag ghost (shape only), rendered off-screen so it's opaque for the snapshot
  const dragImgRef = React.useRef<HTMLDivElement>(null);

  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
    const el = dragImgRef.current;
    if (el) {
      // align top-left of the ghost with the cursor
      e.dataTransfer.setDragImage(el, 0, 0);
    }
  };

  // expose the fill as a css var; css uses it for the glow
  const glow = def.meta.defaultFill;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 1,
        // default hairline border; hover makes it brighter
        borderColor: "divider",
        transition: (t) =>
          t.transitions.create(["box-shadow", "border-color", "transform"], {
            duration: 80,
          }),
        // card rises and border brightens on hover (not just the inner content)
        "&:hover": (t) => ({
          boxShadow: 8,
          borderColor: t.palette.primary.light,
        }),
        // focus ring on the paper so it matches the card bounds
        outline: focusVisible
          ? (t) => `1px solid ${t.palette.primary.main}`
          : "none",
        outlineOffset: 2,
      }}
    >
      {/* off-screen drag image (shape only) */}
      <Box
        ref={dragImgRef}
        sx={{
          position: "fixed",
          top: -10000,
          left: -10000,
          pointerEvents: "none",
          width: 140,
          height: (140 * rows) / cols,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Shape
          type={type}
          width={vw}
          height={vh}
          fill={def.meta.defaultFill}
          fillOpacity={def.meta.defaultOpacity}
          stroke={def.meta.defaultStroke}
          strokeOpacity={def.meta.defaultStrokeOpacity}
          strokeWidth={def.meta.defaultStrokeWidth}
        />
      </Box>

      <ButtonBase
        component="div"
        draggable
        onDragStart={onDragStart}
        onFocusVisible={() => setFocusVisible(true)}
        onBlur={() => setFocusVisible(false)}
        style={{ ["--glow" as any]: glow }}
        sx={{
          width: 1,
          display: "grid",
          gridTemplateRows: "auto auto",
          justifyItems: "center",
          alignItems: "center",
          gap: 0.75,
          borderRadius: 1.5,
          cursor: "grab",
          userSelect: "none",
          p: 0.5,
          // SHAPE-ONLY glow — toned way down (small blur)
          "&:hover svg, &.Mui-focusVisible svg": {
            filter: "drop-shadow(0 0 6px var(--glow))",
          },
        }}
      >
        <Box
          sx={{
            width: 1,
            aspectRatio: `${cols} / ${rows}`,
            display: "grid",
            placeItems: "center",
          }}
          draggable={false}
        >
          <Shape
            type={type}
            width={vw}
            height={vh}
            fill={def.meta.defaultFill}
            fillOpacity={def.meta.defaultOpacity}
            stroke={def.meta.defaultStroke}
            strokeOpacity={def.meta.defaultStrokeOpacity}
            strokeWidth={def.meta.defaultStrokeWidth}
          />
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{
            fontSize: 12,
            lineHeight: 1.15,
            px: 0.5,
            pointerEvents: "none",
          }}
          draggable={false}
        >
          {def.meta.label}
        </Typography>
      </ButtonBase>
    </Paper>
  );
}
