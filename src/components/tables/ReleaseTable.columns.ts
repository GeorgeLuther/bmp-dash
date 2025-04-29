import { MRT_ColumnDef } from "material-react-table";
import { Release } from "./types/Releases";

export const releaseColumns: MRT_ColumnDef<Release>[] = [
  {
    accessorKey: "jobName",
    header: "Job Name",
  },
  {
    accessorKey: "jobNumber",
    header: "Job #",
  },
  {
    accessorKey: "releaseCode",
    header: "Release Code",
  },
  {
    accessorKey: "releaseNumber",
    header: "Release #",
  },
  {
    accessorKey: "totalReleases",
    header: "Total Releases",
  },
  {
    accessorKey: "customerPO",
    header: "Customer PO",
  },
  {
    accessorKey: "poQty",
    header: "PO Qty",
  },
  {
    accessorKey: "blanketQty",
    header: "Blanket Qty",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "weekEnding",
    header: "Week Ending",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "expediteNotes",
    header: "Expedite Notes",
  },
  {
    accessorKey: "kitLocations",
    header: "Kit Locations",
  },
  {
    accessorKey: "kitStatus",
    header: "Kit Status",
  },
  {
    accessorKey: "customerKit",
    header: "Customer Kit",
  },
  {
    accessorKey: "travelerToProduction",
    header: "Traveler To Production",
  },
  {
    accessorKey: "shearHours",
    header: "Shear Hours",
  },
  {
    accessorKey: "cncHours",
    header: "CNC Hours",
  },
  {
    accessorKey: "punchPressHours",
    header: "Punch Press Hours",
  },
  {
    accessorKey: "coilLineHours",
    header: "Coil Line Hours",
  },
  {
    accessorKey: "pemHours",
    header: "PEM Hours",
  },
  {
    accessorKey: "brakeHours",
    header: "Brake Hours",
  },
  {
    accessorKey: "brakeSetups",
    header: "Brake Setups",
  },
  {
    accessorKey: "weldRivetHours",
    header: "Weld Rivet Hours",
  },
  {
    accessorKey: "weldSecondaryOps",
    header: "Weld Secondary Ops",
  },
  {
    accessorKey: "migHours",
    header: "MIG Hours",
  },
  {
    accessorKey: "tigHours",
    header: "TIG Hours",
  },
  {
    accessorKey: "timeWeldHours",
    header: "Time Weld Hours",
  },
  {
    accessorKey: "airWeldHours",
    header: "Air Weld Hours",
  },
  {
    accessorKey: "smallBoxWeldHours",
    header: "Small Box Weld Hours",
  },
  {
    accessorKey: "largeBoxWeldHours",
    header: "Large Box Weld Hours",
  },
  {
    accessorKey: "scoopWeldHours",
    header: "Scoop Weld Hours",
  },
  {
    accessorKey: "weldSetups",
    header: "Weld Setups",
  },
  {
    accessorKey: "paintColor",
    header: "Paint Color",
  },
  {
    accessorKey: "powderLbs",
    header: "Powder Lbs",
  },
  {
    accessorKey: "paintHours",
    header: "Paint Hours",
  },
  {
    accessorKey: "packRiveterHours",
    header: "Pack Riveter Hours",
  },
  {
    accessorKey: "packPopRivetHours",
    header: "Pack Pop Rivet Hours",
  },
  {
    accessorKey: "packScreenHours",
    header: "Pack Screen Hours",
  },
  {
    accessorKey: "packLineHours",
    header: "Pack Line Hours",
  },
  {
    accessorKey: "packCellHours",
    header: "Pack Cell Hours",
  },
];
