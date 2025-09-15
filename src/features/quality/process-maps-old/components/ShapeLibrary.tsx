// components/ShapeLibrary.tsx
import { Box, Grid, Button, Typography } from "@mui/material";
import { SHAPE_BODIES } from "./shapeBodies";
import { toTitle } from "../utils/strings";

type ShapeType = keyof typeof SHAPE_BODIES;

export default function ShapeLibrary({
  onPick,
}: {
  onPick?: (t: ShapeType) => void;
}) {
  const types = Object.keys(SHAPE_BODIES) as ShapeType[];

  // uniform card + preview sizes
  const CARD_W = 164;
  const CARD_H = 120;
  const PREVIEW_G = 14; // 8*14=112 wide, 4*14=56 high → fits snug

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1.25}>
        {types.map((type) => {
          const Body = SHAPE_BODIES[type];
          return (
            <Grid item key={type}>
              <Button
                variant="outlined"
                onClick={onPick ? () => onPick(type) : undefined}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/reactflow", type);
                  e.dataTransfer.effectAllowed = "move";
                  // force the ghost to be exactly the button box
                  e.dataTransfer.setDragImage(
                    e.currentTarget as HTMLElement,
                    24,
                    24
                  );
                }}
                disableRipple
                sx={{
                  width: CARD_W,
                  height: CARD_H,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  cursor: "grab",
                }}
              >
                {/* use defaults from each body; give a slightly thicker stroke */}
                <Body G={PREVIEW_G} strokeWidth={1.6} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {toTitle(type)}
                </Typography>
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
