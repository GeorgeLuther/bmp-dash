import ShapeMenuItem from "./shape-menu-item";
import { shapes, ShapeType } from "../shape/types";
import { Grid, Typography, Box } from "@mui/material";

function ShapeMenu() {
  return (
    // Replaced div with Box and added responsive width
    <Box sx={{ width: { xs: "200px", sm: "300px" } }}>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Drag shapes to the canvas
      </Typography>
      <Grid container spacing={1}>
        {Object.keys(shapes).map((type) => (
          <ShapeMenuItem type={type as ShapeType} key={type} />
        ))}
      </Grid>
    </Box>
  );
}

export default ShapeMenu;
