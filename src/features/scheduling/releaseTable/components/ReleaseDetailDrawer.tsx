//src/features/scheduling/releaseTable/components/ReleaseDetailDrawer.tsx
import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
  Grid,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Release } from "../types/Release.types";

interface ReleaseDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  rowData: Release | null;
}

const steps = [
  "Prospecting",
  "Quoting",
  "Design",
  "Purchasing",
  "Routing",
  "Production",
  "Shipping",
  "Feedback",
  "Quality",
  "KPIs",
];

const kpiData = [
  { month: "Jan", onTime: 92, cycleTime: 5.3 },
  { month: "Feb", onTime: 88, cycleTime: 6.1 },
  { month: "Mar", onTime: 95, cycleTime: 4.7 },
  { month: "Apr", onTime: 90, cycleTime: 5.8 },
  { month: "May", onTime: 97, cycleTime: 4.3 },
];

const FieldPair = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value || "N/A"}</Typography>
  </Box>
);

const renderStepContent = (step: string, rowData: Release | null) => {
  if (!rowData) return null;

  switch (step) {
    case "Prospecting":
      return (
        <>
          <FieldPair label="Job Name" value={rowData.ms_job_name} />
          <FieldPair label="Job ID" value={rowData.job_id} />
        </>
      );

    case "Quoting":
      return (
        <>
          <FieldPair label="Customer PO" value={rowData.ms_customer_po} />
          <FieldPair label="PO Date" value={rowData.ms_po_date} />
          <FieldPair label="Due Date" value={rowData.ms_due_date} />
          <Divider sx={{ my: 2 }} />
          <FieldPair label="Comments" value={rowData.ms_comments} />
          <FieldPair label="Expedite Notes" value={rowData.expedite_notes} />
        </>
      );

    case "Design":
      return (
        <>
          <Typography variant="body2">Design not yet implemented</Typography>
        </>
      );

    case "Purchasing":
      return (
        <>
          <FieldPair
            label="Purchasing Status"
            value={rowData.purchasing_status}
          />
        </>
      );

    case "Routing":
      return (
        <>
          <Typography variant="body2" gutterBottom>
            Estimated Hours (Sample Only)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FieldPair label="Shear" value={rowData.shear_hours} />
              <FieldPair label="CNC" value={rowData.cnc_hours} />
              <FieldPair label="Punch" value={rowData.punch_hours} />
            </Grid>
            <Grid item xs={6}>
              <FieldPair label="Brake" value={rowData.all_brake_hours} />
              <FieldPair label="Weld" value={rowData.weld_hours} />
              <FieldPair label="Paint" value={rowData.paint_hours} />
            </Grid>
          </Grid>
        </>
      );

    case "Production":
      return (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Production Progress
          </Typography>
          <Typography variant="body2">Welding</Typography>
          <LinearProgress variant="determinate" value={70} sx={{ mb: 2 }} />

          <Typography variant="body2">Painting</Typography>
          <LinearProgress variant="determinate" value={40} sx={{ mb: 2 }} />

          <Typography variant="body2">Packing</Typography>
          <LinearProgress variant="determinate" value={85} sx={{ mb: 2 }} />

          <Divider sx={{ my: 2 }} />
          <FieldPair
            label="To Prod. Manager"
            value={rowData.date_to_production_manager}
          />
          <FieldPair label="Started" value={rowData.date_to_floor} />
          <FieldPair label="Complete" value={rowData.production_complete_at} />
        </>
      );

    case "Shipping":
      return (
        <>
          <Typography variant="body2">
            Shipping detail section coming soon.
          </Typography>
        </>
      );

    case "Feedback":
      return (
        <>
          <Typography variant="body2">
            Customer feedback summary TBD.
          </Typography>
        </>
      );

    case "Quality":
      return (
        <>
          <Typography variant="body2">
            No linked NCRs or inspection holds yet.
          </Typography>
        </>
      );

    case "KPIs":
      return (
        <>
          <Typography variant="subtitle2" gutterBottom>
            KPI Overview
          </Typography>

          <Typography variant="body2">On-Time Delivery %</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Bar dataKey="onTime" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Avg Cycle Time (days)
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cycleTime" stroke="#d32f2f" />
            </LineChart>
          </ResponsiveContainer>
        </>
      );

    default:
      return (
        <Typography variant="body2" color="text.secondary">
          No data available for this section yet.
        </Typography>
      );
  }
};

const ReleaseDetailDrawer: React.FC<ReleaseDetailDrawerProps> = ({
  open,
  onClose,
  rowData,
}) => {
  const theme = useTheme();
  const appBarHeight = theme.mixins.toolbar.minHeight;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "50vw",
          paddingTop: `${appBarHeight}px`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {rowData?.release_code || "Release Detail"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {rowData ? (
        <Box sx={{ p: 2, overflowY: "auto" }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => setActiveStep(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{steps[activeStep]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderStepContent(steps[activeStep], rowData)}
            </AccordionDetails>
          </Accordion>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No release selected.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default ReleaseDetailDrawer;
