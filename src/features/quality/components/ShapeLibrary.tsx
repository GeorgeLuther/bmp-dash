import * as React from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { NODE_TYPES } from "./shapeNodes";
import { SHAPE_BODIES } from "./shapeBodies";

type ShapeType = keyof typeof NODE_TYPES;
const toTitle = (k: string) =>
  k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ShapeLibrary({
  previewG = 16,
  onPick,
}: {
  previewG?: number; // use 24 for 1:1 with canvas
  onPick?: (t: ShapeType) => void; // click-to-add later
}) {
  const types = Object.keys(NODE_TYPES) as ShapeType[];
  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        {types.map((type) => {
          const Body = SHAPE_BODIES[type];
          return (
            <Grid item key={type}>
              <Button
                variant="outlined"
                onClick={onPick ? () => onPick(type) : undefined}
                sx={{
                  minWidth: 220,
                  p: 1,
                  display: "flex",
                  gap: 1.25,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Body G={previewG} />
                <Typography variant="body2" sx={{ fontWeight: 600, ml: 1 }}>
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
