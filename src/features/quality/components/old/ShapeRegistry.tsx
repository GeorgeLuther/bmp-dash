import { Box, Grid, Typography } from "@mui/material";
import { NODE_TYPES } from "./shapes";

export type ShapeType = keyof typeof NODE_TYPES;
const TYPE_LABEL: Record<ShapeType, string> = {
  action: "Action",
  process: "Process",
  terminator: "Start/End",
  decision: "Decision",
  document: "Document",
  io: "I/O",
  database: "Database",
};
const TYPE_DESC: Partial<Record<ShapeType, string>> = {
  action: "Action/activity",
  process: "Process step",
  terminator: "Start or End",
  decision: "Branching decision",
  document: "Document / record",
  io: "Input/Output",
  database: "Data store",
};

export default function ShapeKey() {
  const types = Object.keys(NODE_TYPES) as ShapeType[];
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Legend / Key
      </Typography>
      <Grid container spacing={1}>
        {types.map((t) => (
          <Grid item key={t}>
            <Box
              sx={{
                p: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                minWidth: 160,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {TYPE_LABEL[t]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {TYPE_DESC[t] ?? "—"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
